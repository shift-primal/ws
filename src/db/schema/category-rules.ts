import {
	pgTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/pg-core";
import { user } from "#/db/schema/auth";
import { categoryEnum } from "#/db/schema/transactions";

export const categoryRules = pgTable(
	"category_rule",
	{
		id: serial().primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		merchant: text().notNull(),
		category: categoryEnum().notNull(),
		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),
	},
	(t) => [
		uniqueIndex("category_rule_user_merchant_idx").on(t.userId, t.merchant),
	],
);

export type DbCategoryRule = typeof categoryRules.$inferSelect;
export type NewCategoryRule = typeof categoryRules.$inferInsert;
