import { describe, expect, it } from "vitest";
import { DEMO_BLOCKED_PATHS } from "#/lib/auth/auth";

describe("DEMO_BLOCKED_PATHS", () => {
	it("blocks every account-mutating endpoint the settings UI can reach", () => {
		expect([...DEMO_BLOCKED_PATHS].sort()).toEqual(
			[
				"/update-user",
				"/change-email",
				"/change-password",
				"/delete-user",
				"/revoke-session",
				"/revoke-sessions",
				"/revoke-other-sessions",
				"/unlink-account",
				"/link-social",
			].sort(),
		);
	});
});
