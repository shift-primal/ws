import { describe, expect, it } from "vitest";
import { DEMO_ACCOUNTS, isDemoAccountEmail } from "#/lib/demo-accounts";

describe("DEMO_ACCOUNTS", () => {
	it("has one entry per seeded demo_data sample file", () => {
		expect(DEMO_ACCOUNTS).toHaveLength(5);
	});

	it("has unique ids and emails", () => {
		expect(new Set(DEMO_ACCOUNTS.map((a) => a.id)).size).toBe(
			DEMO_ACCOUNTS.length,
		);
		expect(new Set(DEMO_ACCOUNTS.map((a) => a.email)).size).toBe(
			DEMO_ACCOUNTS.length,
		);
	});

	it("gives every account a valid-looking email and a non-empty password", () => {
		for (const account of DEMO_ACCOUNTS) {
			expect(account.email).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
			expect(account.password.length).toBeGreaterThanOrEqual(8);
		}
	});
});

describe("isDemoAccountEmail", () => {
	it("recognizes every seeded demo account's email", () => {
		for (const account of DEMO_ACCOUNTS) {
			expect(isDemoAccountEmail(account.email)).toBe(true);
		}
	});

	it("rejects a real user's email", () => {
		expect(isDemoAccountEmail("someone@example.com")).toBe(false);
	});

	it("is case-sensitive, matching the stored email exactly", () => {
		const [account] = DEMO_ACCOUNTS;
		expect(isDemoAccountEmail(account?.email.toUpperCase() as string)).toBe(
			false,
		);
	});
});
