import { CATEGORIES, TRANSACTION_TYPES } from "txcategorizer";
import * as z from "zod";

export const twoYearsAgo = () => `${new Date().getFullYear() - 2}-01-01`;
export const today = () => new Date().toISOString().split("T")[0];

export const transactionQuerySchema = z.object({
	category: z.array(z.enum(CATEGORIES)).optional(),
	type: z.array(z.enum(TRANSACTION_TYPES)).optional(),
	minAmt: z.number().optional(),
	maxAmt: z.number().optional(),
	merchant: z.string().optional(),
	from: z.iso.date().default(() => twoYearsAgo()),
	to: z.iso.date().default(() => today()),
	sortBy: z.enum(["date", "amount", "merchant", "category", "type"]).optional(),
	sortDir: z.enum(["asc", "desc"]).optional(),
	page: z.number().int().min(1).default(1),
	pageSize: z.number().int().min(1).max(100).default(25),
});

export const newTransactionSchema = z.object({
	date: z.iso.date(),
	amount: z.number(),
	merchant: z.string().min(1),
	type: z.enum(TRANSACTION_TYPES),
	category: z.enum(CATEGORIES),
	counterparty: z.string().optional(),
	valuta: z
		.object({
			currency: z.string(),
			exchangeRate: z.number(),
		})
		.optional(),
});

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;

/**
 * Search schema for the dashboard route: same as `transactionQuerySchema`,
 * but `from`/`to` have no default so an unset date range stays out of the
 * URL entirely instead of always carrying today's date.
 */
export const dashboardSearchSchema = transactionQuerySchema.extend({
	from: z.iso.date().optional(),
	to: z.iso.date().optional(),
});

export type DashboardSearch = z.infer<typeof dashboardSearchSchema>;

export type NewTransactionInput = z.infer<typeof newTransactionSchema>;
export const importSchema = z.array(newTransactionSchema);
