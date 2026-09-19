import { inArray } from "drizzle-orm";
import { db } from "#/db";
import { user } from "#/db/schema";
import { DEMO_ACCOUNTS } from "#/lib/demo-accounts";

// Every table that references `user` uses onDelete: "cascade", so deleting
// the user rows also removes their transactions, category rules, sessions
// and accounts.
async function main() {
	const deleted = await db
		.delete(user)
		.where(
			inArray(
				user.email,
				DEMO_ACCOUNTS.map((a) => a.email),
			),
		)
		.returning({ email: user.email });

	console.log(
		`Cleared ${deleted.length} demo accounts${deleted.length > 0 ? `: ${deleted.map((d) => d.email).join(", ")}` : ""}`,
	);
}

main()
	.catch((err) => {
		console.error(err instanceof Error ? err.message : err);
		process.exitCode = 1;
	})
	.finally(() => process.exit());
