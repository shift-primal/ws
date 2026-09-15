import { queryOptions } from "@tanstack/react-query";
import type { TransactionQuery } from "#/lib/schemas/transactions";
import {
	fetchAmtBounds,
	fetchCategoryStats,
	fetchMonthlyStats,
	fetchTransactions,
} from "#/server/functions/transactions";

export const transactionsQuery = (query: TransactionQuery) =>
	queryOptions({
		queryKey: ["transactions", query],
		queryFn: () => fetchTransactions({ data: query }),
	});

export const amtBoundsQuery = queryOptions({
	queryKey: ["transactions", "amt-bounds"],
	queryFn: () => fetchAmtBounds(),
});

export const categoryStatsQuery = (query: TransactionQuery) =>
	queryOptions({
		queryKey: ["transactions", "category-stats", query],
		queryFn: () => fetchCategoryStats({ data: query }),
	});

export const monthlyStatsQuery = (query: TransactionQuery) =>
	queryOptions({
		queryKey: ["transactions", "monthly-stats", query],
		queryFn: () => fetchMonthlyStats({ data: query }),
	});
