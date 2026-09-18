import { describe, expect, it } from "vitest";
import { signColor } from "#/lib/utils";

describe("signColor", () => {
	it("returns destructive for negative amounts", () => {
		expect(signColor(-1)).toBe("destructive");
	});

	it("returns success for positive amounts", () => {
		expect(signColor(1)).toBe("success");
	});

	it("returns success for zero", () => {
		expect(signColor(0)).toBe("success");
	});
});
