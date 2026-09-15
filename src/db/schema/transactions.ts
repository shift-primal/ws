import {
	date,
	index,
	numeric,
	pgEnum,
	pgTable,
	serial,
	text,
} from "drizzle-orm/pg-core";
import { CATEGORIES, TRANSACTION_TYPES } from "txcategorizer";
import { user } from "#/db/schema/auth";

export const categoryEnum = pgEnum("category", CATEGORIES);

export const transactionTypeEnum = pgEnum(
	"transaction_type",
	TRANSACTION_TYPES,
);

export const transactions = pgTable(
	"transactions",
	{
		ownerId: text("owner_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		id: serial().primaryKey(),
		date: date().notNull(),
		amount: numeric().notNull(),
		merchant: text().notNull(),
		counterparty: text(),
		category: categoryEnum().notNull(),
		type: transactionTypeEnum().notNull(),
		currency: text(),
		exchangeRate: numeric("exchange_rate"),
	},
	(t) => [index("transactions_owner_idx").on(t.ownerId)],
);

export type DbTransaction = typeof transactions.$inferSelect;
export type NewTransaction = typeof transactions.$inferInsert;
