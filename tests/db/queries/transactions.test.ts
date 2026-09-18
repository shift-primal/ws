import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#/db";
import { upsertCategoryRule } from "#/db/queries/category-rules";
import {
	deleteAllTransactions,
	deleteTransactions,
	findDuplicateTransactions,
	getAmtBounds,
	getCategoryStats,
	getMonthlyStats,
	getTransactions,
	insertTransactions,
	updateTransactionCategory,
} from "#/db/queries/transactions";
import { categoryRules, user } from "#/db/schema";
import {
	type NewTransactionInput,
	transactionQuerySchema,
} from "#/lib/schemas/transactions";

const testUserId = `test-${randomUUID()}`;

const sampleTransactions: NewTransactionInput[] = [
	{
		date: "2026-06-10",
		amount: -99,
		merchant: "KIWI",
		type: "Varekjøp",
		category: "Dagligvare",
	},
	{
		date: "2026-06-11",
		amount: -50,
		merchant: "STEAM",
		type: "Visa",
		category: "Gaming",
		valuta: {
			currency: "USD",
			exchangeRate: 10.85,
		},
	},
];

const defaultQuery = () => transactionQuerySchema.parse({});

beforeAll(async () => {
	await db.insert(user).values({
		id: testUserId,
		name: "Vitest Test User",
		email: `${testUserId}@example.test`,
	});
});

afterAll(async () => {
	await db.delete(user).where(eq(user.id, testUserId));
});

beforeEach(async () => {
	await deleteAllTransactions(testUserId);
	await db.delete(categoryRules).where(eq(categoryRules.userId, testUserId));
});

describe("insertTransactions", () => {
	it("inserts rows and returns them", async () => {
		const { inserted, skipped } = await insertTransactions(
			testUserId,
			sampleTransactions,
		);

		expect(skipped).toBe(0);
		expect(inserted).toHaveLength(2);
		expect(inserted[0]).toMatchObject({
			userId: testUserId,
			merchant: "KIWI",
			amount: "-99",
			currency: null,
		});
		expect(inserted[1]).toMatchObject({
			merchant: "STEAM",
			currency: "USD",
			exchangeRate: "10.85",
		});
	});

	it("skips rows that duplicate an already-imported transaction", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const result = await insertTransactions(testUserId, sampleTransactions);

		expect(result.inserted).toHaveLength(0);
		expect(result.skipped).toBe(2);

		const all = await getTransactions(testUserId, defaultQuery());
		expect(all.totalResults).toBe(2);
	});

	it("skips duplicates within the same batch", async () => {
		const result = await insertTransactions(testUserId, [
			sampleTransactions[0],
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(result.inserted).toHaveLength(1);
		expect(result.skipped).toBe(1);
	});

	it("applies a saved category rule instead of the incoming category", async () => {
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Mat ute");

		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(inserted[0]?.category).toBe("Mat ute");
	});

	it("leaves the incoming category alone when no rule matches", async () => {
		await upsertCategoryRule(
			testUserId,
			"some other merchant",
			undefined,
			"Mat ute",
		);

		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(inserted[0]?.category).toBe("Dagligvare");
	});

	it("only applies a pass-through merchant's rule to the matching counterparty", async () => {
		await upsertCategoryRule(testUserId, "Paypal", "Steam", "Gaming");

		const { inserted } = await insertTransactions(testUserId, [
			{
				date: "2026-06-10",
				amount: -50,
				merchant: "Paypal",
				counterparty: "Steam",
				type: "Visa",
				category: "Annet",
			},
			{
				date: "2026-06-10",
				amount: -80,
				merchant: "Paypal",
				counterparty: "Netflix",
				type: "Visa",
				category: "Annet",
			},
		]);

		const steam = inserted.find((tx) => tx.counterparty === "Steam");
		const netflix = inserted.find((tx) => tx.counterparty === "Netflix");
		expect(steam?.category).toBe("Gaming");
		expect(netflix?.category).toBe("Annet");
	});
});

describe("updateTransactionCategory", () => {
	it("updates the transaction's category", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);
		const id = inserted[0]?.id as number;

		const updated = await updateTransactionCategory(testUserId, id, "Annet");

		expect(updated?.map((tx) => tx.category)).toEqual(["Annet"]);
	});

	it("re-indexes every other transaction that shares the same merchant", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			{ ...sampleTransactions[0], date: "2026-06-10" },
			{ ...sampleTransactions[0], date: "2026-06-11" },
			{ ...sampleTransactions[0], date: "2026-06-12" },
		] as NewTransactionInput[]);
		const id = inserted[0]?.id as number;

		const updated = await updateTransactionCategory(testUserId, id, "Annet");

		expect(updated).toHaveLength(3);
		expect(updated?.every((tx) => tx.category === "Annet")).toBe(true);

		const all = await getTransactions(testUserId, defaultQuery());
		expect(all.data.every((tx) => tx.category === "Annet")).toBe(true);
	});

	it("does not re-index a different counterparty sharing the same pass-through merchant", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			{
				date: "2026-06-10",
				amount: -50,
				merchant: "Paypal",
				counterparty: "Steam",
				type: "Visa",
				category: "Annet",
			},
			{
				date: "2026-06-11",
				amount: -80,
				merchant: "Paypal",
				counterparty: "Netflix",
				type: "Visa",
				category: "Annet",
			},
		]);
		const steamId = inserted.find((tx) => tx.counterparty === "Steam")
			?.id as number;

		const updated = await updateTransactionCategory(
			testUserId,
			steamId,
			"Gaming",
		);

		expect(updated).toHaveLength(1);
		expect(updated?.[0]?.category).toBe("Gaming");

		const all = await getTransactions(testUserId, defaultQuery());
		const netflix = all.data.find((tx) => tx.counterparty === "Netflix");
		expect(netflix?.category).toBe("Annet");

		const { inserted: reimported } = await insertTransactions(testUserId, [
			{
				date: "2026-07-01",
				amount: -80,
				merchant: "Paypal",
				counterparty: "Netflix",
				type: "Visa",
				category: "Annet",
			},
		]);
		expect(reimported[0]?.category).toBe("Annet");
	});

	it("does not update another user's transaction", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);
		const id = inserted[0]?.id as number;

		const result = await updateTransactionCategory(
			`other-${randomUUID()}`,
			id,
			"Annet",
		);

		expect(result).toBeUndefined();

		const [unchanged] = (await getTransactions(testUserId, defaultQuery()))
			.data;
		expect(unchanged?.category).toBe("Dagligvare");
	});

	it("saves a category rule for the transaction's merchant", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);
		const id = inserted[0]?.id as number;

		await updateTransactionCategory(testUserId, id, "Annet");

		const { inserted: reimported } = await insertTransactions(testUserId, [
			{ ...sampleTransactions[0], date: "2026-07-01" },
		] as NewTransactionInput[]);

		expect(reimported[0]?.category).toBe("Annet");
	});
});

describe("getTransactions", () => {
	it("reads back inserted transactions for the user", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const result = await getTransactions(testUserId, defaultQuery());

		expect(result.totalResults).toBe(2);
		expect(result.data).toHaveLength(2);
	});

	it("does not return another user's transactions", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const result = await getTransactions(
			`other-${randomUUID()}`,
			defaultQuery(),
		);

		expect(result.totalResults).toBe(0);
		expect(result.data).toHaveLength(0);
	});

	it("filters by merchant", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const result = await getTransactions(testUserId, {
			...defaultQuery(),
			merchant: "steam",
		});

		expect(result.totalResults).toBe(1);
		expect(result.data[0]?.merchant).toBe("STEAM");
	});
});

describe("deleteAllTransactions", () => {
	it("removes all of a user's transactions", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const deleted = await deleteAllTransactions(testUserId);
		expect(deleted).toHaveLength(2);

		const result = await getTransactions(testUserId, defaultQuery());
		expect(result.totalResults).toBe(0);
	});
});

describe("deleteTransactions", () => {
	it("removes only the given ids", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			...sampleTransactions,
			{
				date: "2026-06-12",
				amount: -20,
				merchant: "REMA 1000",
				type: "Varekjøp",
				category: "Dagligvare",
			},
		]);
		const [toDelete] = inserted;

		const deleted = await deleteTransactions(testUserId, [
			toDelete?.id as number,
		]);

		expect(deleted).toHaveLength(1);
		const remaining = await getTransactions(testUserId, defaultQuery());
		expect(remaining.totalResults).toBe(2);
		expect(remaining.data.some((tx) => tx.id === toDelete?.id)).toBe(false);
	});

	it("does not delete another user's transaction even if the id matches", async () => {
		const { inserted } = await insertTransactions(
			testUserId,
			sampleTransactions,
		);
		const id = inserted[0]?.id as number;

		const deleted = await deleteTransactions(`other-${randomUUID()}`, [id]);

		expect(deleted).toHaveLength(0);
		const remaining = await getTransactions(testUserId, defaultQuery());
		expect(remaining.totalResults).toBe(2);
	});

	it("returns an empty array for an empty id list without querying", async () => {
		await insertTransactions(testUserId, sampleTransactions);

		const deleted = await deleteTransactions(testUserId, []);

		expect(deleted).toEqual([]);
		const remaining = await getTransactions(testUserId, defaultQuery());
		expect(remaining.totalResults).toBe(2);
	});
});

describe("getAmtBounds", () => {
	it("returns the min and max amount across a user's transactions", async () => {
		await insertTransactions(testUserId, [
			{ ...sampleTransactions[0], amount: -1200 } as NewTransactionInput,
			{ ...sampleTransactions[1], date: "2026-06-12", amount: 5000 },
		]);

		const bounds = await getAmtBounds(testUserId);

		expect(bounds).toEqual({ minBound: -1200, maxBound: 5000 });
	});

	it("returns zero bounds for a user with no transactions", async () => {
		const bounds = await getAmtBounds(`other-${randomUUID()}`);

		expect(bounds).toEqual({ minBound: 0, maxBound: 0 });
	});
});

describe("getCategoryStats", () => {
	it("sums amounts per category and direction", async () => {
		await insertTransactions(testUserId, [
			{ ...sampleTransactions[0], amount: -50 } as NewTransactionInput,
			{
				...sampleTransactions[0],
				date: "2026-06-11",
				amount: -25,
			} as NewTransactionInput,
			{
				date: "2026-06-12",
				amount: 3000,
				merchant: "Employer",
				type: "Lønn",
				category: "Inntekt",
			},
		]);

		const stats = await getCategoryStats(testUserId, defaultQuery());

		const groceries = stats.find(
			(s) => s.category === "Dagligvare" && s.direction === "expense",
		);
		const income = stats.find(
			(s) => s.category === "Inntekt" && s.direction === "income",
		);

		expect(groceries?.total).toBe("-75");
		expect(income?.total).toBe("3000");
	});
});

describe("getMonthlyStats", () => {
	it("buckets income and expense totals by month", async () => {
		await insertTransactions(testUserId, [
			{ ...sampleTransactions[0], date: "2026-05-01", amount: -100 },
			{
				date: "2026-06-01",
				amount: 2000,
				merchant: "Employer",
				type: "Lønn",
				category: "Inntekt",
			},
			{ ...sampleTransactions[0], date: "2026-06-15", amount: -40 },
		] as NewTransactionInput[]);

		const stats = await getMonthlyStats(testUserId, defaultQuery());

		expect(stats).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					month: "2026-05",
					totalIn: 0,
					totalOut: -100,
				}),
				expect.objectContaining({
					month: "2026-06",
					totalIn: 2000,
					totalOut: -40,
				}),
			]),
		);
	});
});

describe("findDuplicateTransactions", () => {
	it("marks nothing as a duplicate before anything is imported", async () => {
		const flags = await findDuplicateTransactions(
			testUserId,
			sampleTransactions,
		);

		expect(flags).toEqual([false, false]);
	});

	it("marks rows that match an already-imported transaction", async () => {
		await insertTransactions(testUserId, [sampleTransactions[0]]);

		const flags = await findDuplicateTransactions(
			testUserId,
			sampleTransactions,
		);

		expect(flags).toEqual([true, false]);
	});

	it("marks the second of two identical rows within the same batch", async () => {
		const flags = await findDuplicateTransactions(testUserId, [
			sampleTransactions[0],
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(flags).toEqual([false, true]);
	});

	it("returns an empty array for an empty input", async () => {
		expect(await findDuplicateTransactions(testUserId, [])).toEqual([]);
	});
});
