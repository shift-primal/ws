import { eq } from "drizzle-orm";
import type { Category } from "txcategorizer";
import { db } from "#/db";
import { categoryRules } from "#/db/schema";

export function categoryRuleKey(
	merchant: string,
	counterparty?: string | null,
) {
	return JSON.stringify([merchant, counterparty ?? ""]);
}

export async function upsertCategoryRule(
	userId: string,
	merchant: string,
	counterparty: string | null | undefined,
	category: Category,
) {
	const [rule] = await db
		.insert(categoryRules)
		.values({ userId, merchant, counterparty: counterparty ?? "", category })
		.onConflictDoUpdate({
			target: [
				categoryRules.userId,
				categoryRules.merchant,
				categoryRules.counterparty,
			],
			set: { category, updatedAt: new Date() },
		})
		.returning();

	return rule;
}

export async function getCategoryRulesMap(userId: string) {
	const rules = await db
		.select({
			merchant: categoryRules.merchant,
			counterparty: categoryRules.counterparty,
			category: categoryRules.category,
		})
		.from(categoryRules)
		.where(eq(categoryRules.userId, userId));

	return new Map(
		rules.map((rule) => [
			categoryRuleKey(rule.merchant, rule.counterparty),
			rule.category,
		]),
	);
}

export async function getCategoryRulesGrouped(userId: string) {
	const rules = await db
		.select({
			merchant: categoryRules.merchant,
			counterparty: categoryRules.counterparty,
			category: categoryRules.category,
		})
		.from(categoryRules)
		.where(eq(categoryRules.userId, userId));

	const grouped: Partial<Record<Category, string[]>> = {};
	for (const rule of rules) {
		const keyword = rule.counterparty || rule.merchant;
		if (!grouped[rule.category]) grouped[rule.category] = [];
		grouped[rule.category]?.push(keyword);
	}
	return grouped;
}
