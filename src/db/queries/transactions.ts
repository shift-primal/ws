import {
	and,
	asc,
	between,
	count,
	desc,
	eq,
	gte,
	ilike,
	inArray,
	lte,
	max,
	min,
	or,
	type SQL,
	sql,
	sum,
} from "drizzle-orm";
import { db } from "#/db";
import { transactions } from "#/db/schema";
import type {
	NewTransactionInput,
	TransactionQuery,
} from "#/lib/schemas/transactions";

function buildConditions(ownerId: string, query?: TransactionQuery) {
	const conditions: (SQL | undefined)[] = [eq(transactions.ownerId, ownerId)];

	if (query?.category?.length)
		conditions.push(inArray(transactions.category, query?.category));

	if (query?.minAmt !== undefined)
		conditions.push(gte(transactions.amount, query?.minAmt.toString()));
	if (query?.maxAmt !== undefined)
		conditions.push(lte(transactions.amount, query?.maxAmt.toString()));

	if (query?.from && query?.to)
		conditions.push(between(transactions.date, query?.from, query?.to));

	if (query?.merchant)
		conditions.push(
			or(
				ilike(transactions.merchant, `%${query?.merchant}%`),
				ilike(transactions.counterparty, `%${query?.merchant}%`),
			),
		);

	return conditions;
}

export async function getCategoryStats(ownerId: string) {
	const where = and(...buildConditions(ownerId));

	const data = db
		.select({
			category: transactions.category,
			total: sum(transactions.amount),
		})
		.from(transactions)
		.where(where)
		.groupBy(transactions.category);

	return data;
}

export async function getMonthlyStats(
	ownerId: string,
	query: TransactionQuery,
) {
	const where = and(...buildConditions(ownerId, query));

	const month = sql<string>`to_char(${transactions.date}, 'YYYY-MM')`;

	const data = await db
		.select({
			month,
			totalIn: sum(
				sql`CASE WHEN ${transactions.amount}::numeric > 0 THEN ${transactions.amount}::numeric ELSE 0 END`,
			),
			totalOut: sum(
				sql`CASE WHEN ${transactions.amount}::numeric < 0 THEN ${transactions.amount}::numeric ELSE 0 END`,
			),
		})
		.from(transactions)
		.where(where)
		.groupBy(month)
		.orderBy(month);

	return data.map((r) => ({
		month: r.month,
		totalIn: parseFloat(r.totalIn ?? "0"),
		totalOut: parseFloat(r.totalOut ?? "0"),
	}));
}

export async function getTransactions(
	ownerId: string,
	query: TransactionQuery,
) {
	const where = and(...buildConditions(ownerId, query));

	const sortColumns = {
		date: transactions.date,
		amount: transactions.amount,
		merchant: transactions.merchant,
		category: transactions.category,
	};

	const col = sortColumns[query.sortBy ?? "date"];
	const orderBy = query.sortDir === "asc" ? asc(col) : desc(col);

	const [
		data,
		[{ totalResults }],
		[{ totalIn, totalOut }],
		[{ unfilteredTotal }],
	] = await Promise.all([
		db
			.select()
			.from(transactions)
			.where(where)
			.orderBy(orderBy, asc(transactions.id))
			.limit(query.pageSize)
			.offset((query.page - 1) * query.pageSize),

		db
			.select({
				totalResults: count(),
			})
			.from(transactions)
			.where(where),

		db
			.select({
				totalIn: sum(
					sql`CASE WHEN ${transactions.amount}::numeric > 0 THEN ${transactions.amount}::numeric ELSE 0 END`,
				),
				totalOut: sum(
					sql`CASE WHEN ${transactions.amount}::numeric < 0 THEN ${transactions.amount}::numeric ELSE 0 END`,
				),
			})
			.from(transactions)
			.where(where),

		db
			.select({
				unfilteredTotal: count(),
			})
			.from(transactions)
			.where(eq(transactions.ownerId, ownerId)),
	]);

	return {
		data,
		totalResults,
		unfilteredTotal,
		totalIn: parseFloat(totalIn ?? "0"),
		totalOut: parseFloat(totalOut ?? "0"),
	};
}

export async function getAmtBounds(ownerId: string) {
	const [row] = await db
		.select({
			minBound: min(transactions.amount),
			maxBound: max(transactions.amount),
		})
		.from(transactions)
		.where(eq(transactions.ownerId, ownerId));

	return {
		minBound: parseFloat(row.minBound ?? "0"),
		maxBound: parseFloat(row.maxBound ?? "0"),
	};
}

export async function insertTransactions(
	ownerId: string,
	rows: NewTransactionInput[],
) {
	return db
		.insert(transactions)
		.values(
			rows.map(({ valuta, ...rest }) => ({
				...rest,
				ownerId,
				amount: rest.amount.toString(),
				currency: valuta?.currency ?? null,
				exchangeRate: valuta?.exchangeRate?.toString() ?? null,
			})),
		)
		.returning();
}

export async function deleteTransactions(ownerId: string, ids: number[]) {
	if (ids.length === 0) return [];
	return db
		.delete(transactions)
		.where(
			and(eq(transactions.ownerId, ownerId), inArray(transactions.id, ids)),
		)
		.returning();
}

export async function deleteAllTransactions(ownerId: string) {
	return db
		.delete(transactions)
		.where(eq(transactions.ownerId, ownerId))
		.returning();
}
