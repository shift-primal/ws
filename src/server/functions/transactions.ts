import { createServerFn } from "@tanstack/react-start";
import {
	deleteAllTransactions,
	getAmtBounds,
	getCategoryStats,
	getMonthlyStats,
	getTransactions,
	insertTransactions,
} from "#/db/queries";
import {
	importSchema,
	transactionQuerySchema,
} from "#/lib/schemas/transactions";
import { authMiddleware } from "#/server/middleware/auth";

export const fetchTransactions = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.validator(transactionQuerySchema)
	.handler(({ data, context }) => getTransactions(context.userId, data));

export const fetchCategoryStats = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.handler(({ context }) => getCategoryStats(context.userId));

export const fetchMonthlyStats = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.validator(transactionQuerySchema)
	.handler(({ data, context }) => getMonthlyStats(context.userId, data));

export const fetchAmtBounds = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.handler(({ context }) => getAmtBounds(context.userId));

export const importTransactions = createServerFn({
	method: "POST",
})
	.middleware([authMiddleware])
	.validator(importSchema)
	.handler(({ data, context }) => insertTransactions(context.userId, data));

export const clearTransactions = createServerFn({
	method: "POST",
})
	.middleware([authMiddleware])
	.handler(({ context }) => deleteAllTransactions(context.userId));
