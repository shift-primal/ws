import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#/db";
import { upsertCategoryRule } from "#/db/queries/category-rules";
import {
	deleteAllTransactions,
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
		await upsertCategoryRule(testUserId, "KIWI", "Mat ute");

		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(inserted[0]?.category).toBe("Mat ute");
	});

	it("leaves the incoming category alone when no rule matches", async () => {
		await upsertCategoryRule(testUserId, "some other merchant", "Mat ute");

		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);

		expect(inserted[0]?.category).toBe("Dagligvare");
	});
});

describe("updateTransactionCategory", () => {
	it("updates the transaction's category", async () => {
		const { inserted } = await insertTransactions(testUserId, [
			sampleTransactions[0],
		] as NewTransactionInput[]);
		const id = inserted[0]?.id as number;

		const updated = await updateTransactionCategory(testUserId, id, "Annet");

		expect(updated?.category).toBe("Annet");
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
