import { eq } from "drizzle-orm";
import type { Category } from "txcategorizer";
import { db } from "#/db";
import { categoryRules } from "#/db/schema";

export async function upsertCategoryRule(
	userId: string,
	merchant: string,
	category: Category,
) {
	const [rule] = await db
		.insert(categoryRules)
		.values({ userId, merchant, category })
		.onConflictDoUpdate({
			target: [categoryRules.userId, categoryRules.merchant],
			set: { category, updatedAt: new Date() },
		})
		.returning();

	return rule;
}

export async function getCategoryRulesMap(userId: string) {
	const rules = await db
		.select({
			merchant: categoryRules.merchant,
			category: categoryRules.category,
		})
		.from(categoryRules)
		.where(eq(categoryRules.userId, userId));

	return new Map(rules.map((rule) => [rule.merchant, rule.category]));
}

export async function getCategoryRulesGrouped(userId: string) {
	const rules = await db
		.select({
			merchant: categoryRules.merchant,
			category: categoryRules.category,
		})
		.from(categoryRules)
		.where(eq(categoryRules.userId, userId));

	const grouped: Partial<Record<Category, string[]>> = {};
	for (const rule of rules) {
		if (!grouped[rule.category]) grouped[rule.category] = [];
		grouped[rule.category]?.push(rule.merchant);
	}
	return grouped;
}
