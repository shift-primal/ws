import { afterEach, describe, expect, it } from "vitest";
import {
	clearTwoFactorMethods,
	isTwoFactorRedirect,
	parseTwoFactorMethods,
	readTwoFactorMethods,
	storeTwoFactorMethods,
	TWO_FACTOR_METHODS_STORAGE_KEY,
} from "#/lib/auth/two-factor-methods";

describe("isTwoFactorRedirect", () => {
	it("recognizes the two-factor redirect payload", () => {
		expect(isTwoFactorRedirect({ twoFactorRedirect: true })).toBe(true);
	});

	it("rejects a normal sign-in response", () => {
		expect(isTwoFactorRedirect({ user: { id: "1" } })).toBe(false);
	});

	it("rejects non-object values", () => {
		expect(isTwoFactorRedirect(null)).toBe(false);
		expect(isTwoFactorRedirect(undefined)).toBe(false);
		expect(isTwoFactorRedirect("twoFactorRedirect")).toBe(false);
	});
});

describe("parseTwoFactorMethods", () => {
	it("keeps only known methods, in canonical order", () => {
		expect(parseTwoFactorMethods(["otp", "totp", "passkey"])).toEqual([
			"totp",
			"otp",
		]);
	});

	it("returns an empty array for non-array input", () => {
		expect(parseTwoFactorMethods(undefined)).toEqual([]);
		expect(parseTwoFactorMethods("totp")).toEqual([]);
	});

	it("returns an empty array when nothing matches", () => {
		expect(parseTwoFactorMethods(["magicLink"])).toEqual([]);
	});
});

describe("session storage helpers", () => {
	// This runtime provides a real global `sessionStorage` (Node's built-in
	// Web Storage), so each test controls the global explicitly instead of
	// relying on the environment's default.
	const originalDescriptor = Object.getOwnPropertyDescriptor(
		globalThis,
		"sessionStorage",
	);

	function installFakeSessionStorage() {
		const store = new Map<string, string>();
		Object.defineProperty(globalThis, "sessionStorage", {
			configurable: true,
			value: {
				getItem: (key: string) => store.get(key) ?? null,
				setItem: (key: string, value: string) => {
					store.set(key, value);
				},
				removeItem: (key: string) => {
					store.delete(key);
				},
			},
		});
		return store;
	}

	function removeSessionStorage() {
		Object.defineProperty(globalThis, "sessionStorage", {
			configurable: true,
			value: undefined,
		});
	}

	afterEach(() => {
		if (originalDescriptor) {
			Object.defineProperty(globalThis, "sessionStorage", originalDescriptor);
		} else {
			delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
		}
	});

	it("no-ops when sessionStorage is unavailable", () => {
		removeSessionStorage();

		expect(() => storeTwoFactorMethods(["totp"])).not.toThrow();
		expect(readTwoFactorMethods()).toEqual(["totp", "otp"]);
		expect(() => clearTwoFactorMethods()).not.toThrow();
	});

	it("stores and reads back the enabled methods", () => {
		installFakeSessionStorage();

		storeTwoFactorMethods(["otp"]);

		expect(readTwoFactorMethods()).toEqual(["otp"]);
	});

	it("falls back to every method when nothing is stored", () => {
		installFakeSessionStorage();

		expect(readTwoFactorMethods()).toEqual(["totp", "otp"]);
	});

	it("falls back to every method when the stored value is corrupt", () => {
		const store = installFakeSessionStorage();
		store.set(TWO_FACTOR_METHODS_STORAGE_KEY, "not json");

		expect(readTwoFactorMethods()).toEqual(["totp", "otp"]);
	});

	it("removes the stored methods on clear", () => {
		const store = installFakeSessionStorage();
		storeTwoFactorMethods(["totp"]);

		clearTwoFactorMethods();

		expect(store.has(TWO_FACTOR_METHODS_STORAGE_KEY)).toBe(false);
	});
});
