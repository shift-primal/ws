import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#/db";
import {
	getCategoryRulesGrouped,
	getCategoryRulesMap,
	upsertCategoryRule,
} from "#/db/queries/category-rules";
import { categoryRules, user } from "#/db/schema";

const testUserId = `test-${randomUUID()}`;

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
	await db.delete(categoryRules).where(eq(categoryRules.userId, testUserId));
});

describe("upsertCategoryRule", () => {
	it("creates a rule for a merchant", async () => {
		const rule = await upsertCategoryRule(testUserId, "KIWI", "Dagligvare");

		expect(rule).toMatchObject({
			userId: testUserId,
			merchant: "KIWI",
			category: "Dagligvare",
		});
	});

	it("replaces the existing rule when the same merchant is corrected again", async () => {
		await upsertCategoryRule(testUserId, "KIWI", "Dagligvare");
		await upsertCategoryRule(testUserId, "KIWI", "Mat ute");

		const rules = await getCategoryRulesMap(testUserId);

		expect(rules.size).toBe(1);
		expect(rules.get("KIWI")).toBe("Mat ute");
	});
});

describe("getCategoryRulesMap", () => {
	it("returns a merchant -> category map scoped to the user", async () => {
		await upsertCategoryRule(testUserId, "KIWI", "Dagligvare");
		await upsertCategoryRule(testUserId, "STEAM", "Gaming");

		const rules = await getCategoryRulesMap(testUserId);

		expect(rules.get("KIWI")).toBe("Dagligvare");
		expect(rules.get("STEAM")).toBe("Gaming");
	});

	it("does not return another user's rules", async () => {
		await upsertCategoryRule(testUserId, "KIWI", "Dagligvare");

		const rules = await getCategoryRulesMap(`other-${randomUUID()}`);

		expect(rules.size).toBe(0);
	});
});

describe("getCategoryRulesGrouped", () => {
	it("groups merchants by category, matching txcategorizer's categoryKeywords shape", async () => {
		await upsertCategoryRule(testUserId, "KIWI", "Dagligvare");
		await upsertCategoryRule(testUserId, "REMA 1000", "Dagligvare");
		await upsertCategoryRule(testUserId, "STEAM", "Gaming");

		const grouped = await getCategoryRulesGrouped(testUserId);

		expect(grouped.Dagligvare).toEqual(
			expect.arrayContaining(["KIWI", "REMA 1000"]),
		);
		expect(grouped.Gaming).toEqual(["STEAM"]);
	});
});
