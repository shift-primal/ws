import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { db } from "#/db";
import {
	categoryRuleKey,
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
	it("creates a rule for a merchant with no counterparty", async () => {
		const rule = await upsertCategoryRule(
			testUserId,
			"KIWI",
			undefined,
			"Dagligvare",
		);

		expect(rule).toMatchObject({
			userId: testUserId,
			merchant: "KIWI",
			counterparty: "",
			category: "Dagligvare",
		});
	});

	it("replaces the existing rule when the same merchant+counterparty is corrected again", async () => {
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Dagligvare");
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Mat ute");

		const rules = await getCategoryRulesMap(testUserId);

		expect(rules.size).toBe(1);
		expect(rules.get(categoryRuleKey("KIWI"))).toBe("Mat ute");
	});

	it("keeps rules for the same pass-through merchant separate per counterparty", async () => {
		await upsertCategoryRule(testUserId, "Paypal", "Steam", "Gaming");
		await upsertCategoryRule(testUserId, "Paypal", "Netflix", "Abonnement");

		const rules = await getCategoryRulesMap(testUserId);

		expect(rules.size).toBe(2);
		expect(rules.get(categoryRuleKey("Paypal", "Steam"))).toBe("Gaming");
		expect(rules.get(categoryRuleKey("Paypal", "Netflix"))).toBe("Abonnement");
	});
});

describe("getCategoryRulesMap", () => {
	it("returns a (merchant, counterparty) -> category map scoped to the user", async () => {
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Dagligvare");
		await upsertCategoryRule(testUserId, "Paypal", "Steam", "Gaming");

		const rules = await getCategoryRulesMap(testUserId);

		expect(rules.get(categoryRuleKey("KIWI"))).toBe("Dagligvare");
		expect(rules.get(categoryRuleKey("Paypal", "Steam"))).toBe("Gaming");
		expect(rules.get(categoryRuleKey("Paypal", "Netflix"))).toBeUndefined();
	});

	it("does not return another user's rules", async () => {
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Dagligvare");

		const rules = await getCategoryRulesMap(`other-${randomUUID()}`);

		expect(rules.size).toBe(0);
	});
});

describe("getCategoryRulesGrouped", () => {
	it("groups plain merchants by category, matching txcategorizer's categoryKeywords shape", async () => {
		await upsertCategoryRule(testUserId, "KIWI", undefined, "Dagligvare");
		await upsertCategoryRule(testUserId, "REMA 1000", undefined, "Dagligvare");
		await upsertCategoryRule(testUserId, "STEAM", undefined, "Gaming");

		const grouped = await getCategoryRulesGrouped(testUserId);

		expect(grouped.Dagligvare).toEqual(
			expect.arrayContaining(["KIWI", "REMA 1000"]),
		);
		expect(grouped.Gaming).toEqual(["STEAM"]);
	});

	it("exports the counterparty, not the merchant, for pass-through rules", async () => {
		await upsertCategoryRule(testUserId, "Paypal", "Steam", "Gaming");

		const grouped = await getCategoryRulesGrouped(testUserId);

		expect(grouped.Gaming).toEqual(["Steam"]);
	});
});
