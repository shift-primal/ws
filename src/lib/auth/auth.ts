import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { dash } from "@better-auth/infra";
import { betterAuth } from "better-auth";
import {
	APIError,
	createAuthMiddleware,
	getSessionFromCtx,
} from "better-auth/api";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { db } from "#/db";
import * as schema from "#/db/schema";
import { isDemoAccountEmail } from "#/lib/demo-accounts";

// Account-mutating endpoints that would break the shared, publicly
// reachable demo accounts (locking out other visitors, wiping the seeded
// data, etc). Blocked here so every client — the settings UI, API callers,
// anything — goes through the same check, not just our own server fns.
export const DEMO_BLOCKED_PATHS = new Set([
	"/update-user",
	"/change-email",
	"/change-password",
	"/delete-user",
	"/revoke-session",
	"/revoke-sessions",
	"/revoke-other-sessions",
	"/unlink-account",
	"/link-social",
]);

export const auth = betterAuth({
	database: drizzleAdapter(db, { provider: "pg", schema }),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [dash(), tanstackStartCookies()],
	hooks: {
		before: createAuthMiddleware(async (ctx) => {
			if (!DEMO_BLOCKED_PATHS.has(ctx.path)) return;
			const session = await getSessionFromCtx(ctx, { disableRefresh: true });
			if (!session || !isDemoAccountEmail(session.user.email)) return;
			throw APIError.fromStatus("FORBIDDEN", {
				code: "DEMO_ACCOUNT_FORBIDDEN",
				message: "Demo accounts can't modify account settings",
			});
		}),
	},
});
