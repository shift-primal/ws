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

const incomeAmount = sql`CASE WHEN ${transactions.amount}::numeric > 0 THEN ${transactions.amount}::numeric ELSE 0 END`;
const expenseAmount = sql`CASE WHEN ${transactions.amount}::numeric < 0 THEN ${transactions.amount}::numeric ELSE 0 END`;
const direction = sql<
	"income" | "expense"
>`CASE WHEN ${transactions.amount}::numeric > 0 THEN 'income' ELSE 'expense' END`;

function buildConditions(userId: string, query?: TransactionQuery) {
	const conditions: (SQL | undefined)[] = [eq(transactions.userId, userId)];

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

export async function getCategoryStats(
	userId: string,
	query?: TransactionQuery,
) {
	const where = and(...buildConditions(userId, query));

	const data = db
		.select({
			category: transactions.category,
			direction,
			total: sum(transactions.amount),
		})
		.from(transactions)
		.where(where)
		.groupBy(transactions.category, direction);

	return data;
}

export async function getMonthlyStats(userId: string, query: TransactionQuery) {
	const where = and(...buildConditions(userId, query));

	const month = sql<string>`to_char(${transactions.date}, 'YYYY-MM')`;

	const data = await db
		.select({
			month,
			totalIn: sum(incomeAmount),
			totalOut: sum(expenseAmount),
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

export async function getTransactions(userId: string, query: TransactionQuery) {
	const where = and(...buildConditions(userId, query));

	const sortColumns = {
		date: transactions.date,
		amount: transactions.amount,
		merchant: transactions.merchant,
		category: transactions.category,
	};

	const col = sortColumns[query.sortBy ?? "date"];
	const orderBy = query.sortDir === "asc" ? asc(col) : desc(col);

	const [data, [{ totalResults }], [{ totalIn, totalOut }]] = await Promise.all(
		[
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
					totalIn: sum(incomeAmount),
					totalOut: sum(expenseAmount),
				})
				.from(transactions)
				.where(where),
		],
	);

	return {
		data,
		totalResults,
		totalIn: parseFloat(totalIn ?? "0"),
		totalOut: parseFloat(totalOut ?? "0"),
	};
}

export async function getAmtBounds(userId: string) {
	const [row] = await db
		.select({
			minBound: min(transactions.amount),
			maxBound: max(transactions.amount),
		})
		.from(transactions)
		.where(eq(transactions.userId, userId));

	return {
		minBound: parseFloat(row.minBound ?? "0"),
		maxBound: parseFloat(row.maxBound ?? "0"),
	};
}

function duplicateKey(tx: {
	date: string;
	amount: number;
	merchant: string;
	type: string;
	counterparty?: string | null;
}) {
	return [
		tx.date,
		tx.amount.toFixed(2),
		tx.merchant,
		tx.type,
		tx.counterparty ?? "",
	].join("|");
}

async function getExistingKeys(userId: string, rows: NewTransactionInput[]) {
	const dates = rows.map((row) => row.date);
	const from = dates.reduce((a, b) => (b < a ? b : a));
	const to = dates.reduce((a, b) => (b > a ? b : a));

	const existing = await db
		.select({
			date: transactions.date,
			amount: transactions.amount,
			merchant: transactions.merchant,
			type: transactions.type,
			counterparty: transactions.counterparty,
		})
		.from(transactions)
		.where(
			and(
				eq(transactions.userId, userId),
				between(transactions.date, from, to),
			),
		);

	return new Set(
		existing.map((tx) =>
			duplicateKey({ ...tx, amount: parseFloat(tx.amount) }),
		),
	);
}

async function markDuplicates(userId: string, rows: NewTransactionInput[]) {
	if (rows.length === 0) return [] as boolean[];

	const seenKeys = await getExistingKeys(userId, rows);

	return rows.map((row) => {
		const key = duplicateKey(row);
		if (seenKeys.has(key)) return true;
		seenKeys.add(key);
		return false;
	});
}

export async function findDuplicateTransactions(
	userId: string,
	rows: NewTransactionInput[],
) {
	return markDuplicates(userId, rows);
}

export async function insertTransactions(
	userId: string,
	rows: NewTransactionInput[],
) {
	if (rows.length === 0) return { inserted: [], skipped: 0 };

	const inserted = await db
		.insert(transactions)
		.values(
			rows.map(({ valuta, ...rest }) => ({
				...rest,
				userId,
				amount: rest.amount.toString(),
				currency: valuta?.currency ?? null,
				exchangeRate: valuta?.exchangeRate?.toString() ?? null,
			})),
		)
		.onConflictDoNothing()
		.returning();

	return { inserted, skipped: rows.length - inserted.length };
}

export async function deleteTransactions(userId: string, ids: number[]) {
	if (ids.length === 0) return [];
	return db
		.delete(transactions)
		.where(and(eq(transactions.userId, userId), inArray(transactions.id, ids)))
		.returning();
}

export async function deleteAllTransactions(userId: string) {
	return db
		.delete(transactions)
		.where(eq(transactions.userId, userId))
		.returning();
}
