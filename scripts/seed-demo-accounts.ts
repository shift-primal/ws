import { readFileSync } from "node:fs";
import { eq } from "drizzle-orm";
import { processTransactions } from "txcategorizer";
import { db } from "#/db";
import { insertTransactions } from "#/db/queries/transactions";
import { user } from "#/db/schema";
import { auth } from "#/lib/auth/auth";
import { DEMO_ACCOUNTS } from "#/lib/demo-accounts";

async function resolveUserId(email: string, name: string): Promise<string> {
	const [existing] = await db.select().from(user).where(eq(user.email, email));
	if (existing) return existing.id;

	const result = await auth.api.signUpEmail({
		body: { email, password: findAccount(email).password, name },
		// Without a User-Agent, better-auth stores an empty string on the
		// created session, which crashes the settings page's active-sessions
		// list (it hands the value straight to a UA parser that requires a
		// non-empty string).
		headers: new Headers({ "user-agent": "wastescope-seed-script" }),
	});
	return result.user.id;
}

function findAccount(email: string) {
	const account = DEMO_ACCOUNTS.find((a) => a.email === email);
	if (!account) throw new Error(`Unknown demo account: ${email}`);
	return account;
}

async function main() {
	for (const [index, account] of DEMO_ACCOUNTS.entries()) {
		const userId = await resolveUserId(account.email, account.name);

		const file = `demo_data/sample_transactions_${index + 1}.txt`;
		const content = readFileSync(file, "utf-8");
		const rows = processTransactions(content, "dnb");

		const { inserted, skipped } = await insertTransactions(userId, rows);

		console.log(
			`${account.email}: inserted ${inserted.length}${skipped > 0 ? ` (skipped ${skipped} duplicates)` : ""}`,
		);
	}
}

main()
	.catch((err) => {
		console.error(err instanceof Error ? err.message : err);
		process.exitCode = 1;
	})
	.finally(() => process.exit());
