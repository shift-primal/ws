import { describe, expect, it } from "vitest";
import {
	dashboardSearchSchema,
	newTransactionSchema,
	today,
	transactionQuerySchema,
	twoYearsAgo,
} from "#/lib/schemas/transactions";

describe("twoYearsAgo", () => {
	it("returns January 1st two years before the current year", () => {
		const expectedYear = new Date().getFullYear() - 2;
		expect(twoYearsAgo()).toBe(`${expectedYear}-01-01`);
	});
});

describe("today", () => {
	it("returns an ISO date string", () => {
		expect(today()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
	});
});

describe("transactionQuerySchema", () => {
	it("fills in defaults when nothing is provided", () => {
		const result = transactionQuerySchema.parse({});

		expect(result.from).toBe(twoYearsAgo());
		expect(result.to).toBe(today());
		expect(result.page).toBe(1);
		expect(result.pageSize).toBe(25);
	});

	it("keeps explicitly provided values instead of the defaults", () => {
		const result = transactionQuerySchema.parse({
			from: "2020-01-01",
			to: "2020-12-31",
			page: 3,
			pageSize: 50,
		});

		expect(result).toMatchObject({
			from: "2020-01-01",
			to: "2020-12-31",
			page: 3,
			pageSize: 50,
		});
	});

	it("rejects a page below 1", () => {
		expect(() => transactionQuerySchema.parse({ page: 0 })).toThrow();
	});

	it("rejects a pageSize above 100", () => {
		expect(() => transactionQuerySchema.parse({ pageSize: 101 })).toThrow();
	});

	it("rejects an unknown category", () => {
		expect(() =>
			transactionQuerySchema.parse({ category: ["NotACategory"] }),
		).toThrow();
	});
});

describe("dashboardSearchSchema", () => {
	it("leaves from/to unset instead of defaulting them", () => {
		const result = dashboardSearchSchema.parse({});

		expect(result.from).toBeUndefined();
		expect(result.to).toBeUndefined();
	});

	it("still defaults page and pageSize", () => {
		const result = dashboardSearchSchema.parse({});

		expect(result.page).toBe(1);
		expect(result.pageSize).toBe(25);
	});
});

describe("newTransactionSchema", () => {
	const valid = {
		date: "2026-06-10",
		amount: -99,
		merchant: "KIWI",
		type: "Varekjøp",
		category: "Dagligvare",
	};

	it("accepts a minimal valid transaction", () => {
		expect(newTransactionSchema.parse(valid)).toMatchObject(valid);
	});

	it("accepts an optional valuta object", () => {
		const result = newTransactionSchema.parse({
			...valid,
			valuta: { currency: "USD", exchangeRate: 10.85 },
		});

		expect(result.valuta).toEqual({ currency: "USD", exchangeRate: 10.85 });
	});

	it("rejects an empty merchant", () => {
		expect(() =>
			newTransactionSchema.parse({ ...valid, merchant: "" }),
		).toThrow();
	});

	it("rejects a non-ISO date", () => {
		expect(() =>
			newTransactionSchema.parse({ ...valid, date: "10.06.2026" }),
		).toThrow();
	});

	it("rejects an unknown transaction type", () => {
		expect(() =>
			newTransactionSchema.parse({ ...valid, type: "NotAType" }),
		).toThrow();
	});
});
