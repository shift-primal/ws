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
import { authMiddleware } from "#/server/auth/middleware";

export const fetchTransactions = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.validator(transactionQuerySchema)
	.handler(({ data, context }) => getTransactions(context.ownerId, data));

export const fetchCategoryStats = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.handler(({ context }) => getCategoryStats(context.ownerId));

export const fetchMonthlyStats = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.validator(transactionQuerySchema)
	.handler(({ data, context }) => getMonthlyStats(context.ownerId, data));

export const fetchAmtBounds = createServerFn({
	method: "GET",
})
	.middleware([authMiddleware])
	.handler(({ context }) => getAmtBounds(context.ownerId));

export const importTransactions = createServerFn({
	method: "POST",
})
	.middleware([authMiddleware])
	.validator(importSchema)
	.handler(({ data, context }) => insertTransactions(context.ownerId, data));

export const clearTransactions = createServerFn({
	method: "POST",
})
	.middleware([authMiddleware])
	.handler(({ context }) => deleteAllTransactions(context.ownerId));
