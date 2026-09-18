import { describe, expect, it } from "vitest";
import {
	fmtCurrency,
	fmtCurrencyCompact,
	fmtExchangeRate,
	fmtFileSize,
	fmtShortDate,
	monthLabel,
} from "#/lib/fmt";

describe("fmtCurrency", () => {
	it("formats an amount as NOK currency", () => {
		// nb-NO uses non-breaking spaces between groups; normalize whitespace.
		expect(fmtCurrency(1234.5).replace(/\s/g, " ")).toContain("1 234,50");
	});
});

describe("monthLabel", () => {
	it("formats a YYYY-MM month with the given date-fns pattern", () => {
		expect(monthLabel("2026-03", "LLL yyyy")).toBe("Mar 2026");
	});
});

describe("fmtShortDate", () => {
	it("formats an ISO date as dd.MM.yy", () => {
		expect(fmtShortDate("2026-03-05")).toBe("05.03.26");
	});
});

describe("fmtCurrencyCompact", () => {
	it("formats small amounts as whole numbers", () => {
		expect(fmtCurrencyCompact(42)).toBe("42");
		expect(fmtCurrencyCompact(999)).toBe("999");
	});

	it("formats thousands with one decimal and a comma", () => {
		expect(fmtCurrencyCompact(1500)).toBe("1,5K");
	});

	it("formats amounts at or above 100K without decimals", () => {
		expect(fmtCurrencyCompact(150_000)).toBe("150K");
	});

	it("formats amounts at or above 1M with an M suffix", () => {
		expect(fmtCurrencyCompact(2_500_000)).toBe("2.5M");
	});

	it("drops a trailing .0 for whole millions", () => {
		expect(fmtCurrencyCompact(3_000_000)).toBe("3M");
	});

	it("preserves the sign for negative amounts", () => {
		expect(fmtCurrencyCompact(-1500)).toBe("-1,5K");
	});
});

describe("fmtExchangeRate", () => {
	it("formats a rate string to 2 decimals", () => {
		expect(fmtExchangeRate("10.8")).toBe("10.80");
		expect(fmtExchangeRate("0.9412")).toBe("0.94");
	});
});

describe("fmtFileSize", () => {
	it("formats 0 bytes", () => {
		expect(fmtFileSize(0)).toBe("0 B");
	});

	it("formats bytes without decimals", () => {
		expect(fmtFileSize(512)).toBe("512 B");
	});

	it("formats kilobytes with one decimal", () => {
		expect(fmtFileSize(2048)).toBe("2.0 KB");
	});

	it("formats megabytes with one decimal", () => {
		expect(fmtFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
	});

	it("caps at GB for very large sizes", () => {
		expect(fmtFileSize(1024 ** 4)).toBe("1024.0 GB");
	});
});
