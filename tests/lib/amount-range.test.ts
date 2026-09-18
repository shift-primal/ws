import { describe, expect, it } from "vitest";
import {
	type AmountBounds,
	amountToPosition,
	positionToAmount,
} from "#/lib/amount-range";

const bounds: AmountBounds = { minBound: -500, maxBound: 2000 };

describe("amountToPosition", () => {
	it("maps zero to the middle", () => {
		expect(amountToPosition(0, bounds)).toBe(0);
	});

	it("maps the max bound to 1", () => {
		expect(amountToPosition(2000, bounds)).toBe(1);
	});

	it("maps the min bound to -1", () => {
		expect(amountToPosition(-500, bounds)).toBe(-1);
	});

	it("scales the negative and positive sides independently", () => {
		// -250 is halfway to the (lopsided) negative bound.
		expect(amountToPosition(-250, bounds)).toBeCloseTo(-0.5);
		// 1000 is halfway to the positive bound.
		expect(amountToPosition(1000, bounds)).toBeCloseTo(0.5);
	});

	it("returns 0 for negative amounts when the negative bound is 0", () => {
		const allPositive: AmountBounds = { minBound: 0, maxBound: 100 };
		expect(amountToPosition(-10, allPositive)).toBe(0);
	});

	it("returns 0 for positive amounts when the positive bound is 0", () => {
		const allNegative: AmountBounds = { minBound: -100, maxBound: 0 };
		expect(amountToPosition(10, allNegative)).toBe(0);
	});
});

describe("positionToAmount", () => {
	it("is the inverse of amountToPosition", () => {
		for (const amount of [-500, -250, 0, 1000, 2000]) {
			const position = amountToPosition(amount, bounds);
			expect(positionToAmount(position, bounds)).toBeCloseTo(amount);
		}
	});

	it("maps 0 to 0", () => {
		expect(positionToAmount(0, bounds)).toBe(0);
	});

	it("maps -1 to the min bound", () => {
		expect(positionToAmount(-1, bounds)).toBe(-500);
	});

	it("maps 1 to the max bound", () => {
		expect(positionToAmount(1, bounds)).toBe(2000);
	});
});
