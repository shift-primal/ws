import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#/db";
import {
	deleteAllTransactions,
	getTransactions,
	insertTransactions,
} from "#/db/queries/transactions";
import { user } from "#/db/schema";
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
});

describe("insertTransactions", () => {
	it("inserts rows and returns them", async () => {
		const inserted = await insertTransactions(testUserId, sampleTransactions);

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
