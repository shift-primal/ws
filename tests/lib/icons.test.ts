import { CATEGORIES, TRANSACTION_TYPES } from "txcategorizer";
import { describe, expect, it } from "vitest";
import { CATEGORY_ICONS, TYPE_ICONS } from "#/lib/icons";

describe("CATEGORY_ICONS", () => {
	it("has an icon for every category txcategorizer can produce", () => {
		for (const category of CATEGORIES) {
			expect(CATEGORY_ICONS[category]).toBeDefined();
		}
	});

	it("has no stale entries for categories that no longer exist", () => {
		expect(Object.keys(CATEGORY_ICONS).sort()).toEqual([...CATEGORIES].sort());
	});
});

describe("TYPE_ICONS", () => {
	it("has an icon for every transaction type txcategorizer can produce", () => {
		for (const type of TRANSACTION_TYPES) {
			expect(TYPE_ICONS[type]).toBeDefined();
		}
	});

	it("has no stale entries for types that no longer exist", () => {
		expect(Object.keys(TYPE_ICONS).sort()).toEqual(
			[...TRANSACTION_TYPES].sort(),
		);
	});
});
