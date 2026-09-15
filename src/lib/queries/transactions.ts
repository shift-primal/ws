import { queryOptions } from "@tanstack/react-query";
import type { TransactionQuery } from "#/lib/schemas/transactions";
import { fetchTransactions } from "#/server/functions/transactions";

export const transactionsQuery = (query: TransactionQuery) =>
	queryOptions({
		queryKey: ["transactions", query],
		queryFn: () => fetchTransactions({ data: query }),
	});
