import { eq } from "drizzle-orm";
import { db } from "#/db";
import { getCategoryRulesGrouped } from "#/db/queries/category-rules";
import { user } from "#/db/schema";

async function resolveUserId(): Promise<string> {
	const emailArg = process.argv[2];

	if (emailArg) {
		const [match] = await db
			.select()
			.from(user)
			.where(eq(user.email, emailArg));
		if (!match) throw new Error(`No user found with email "${emailArg}"`);
		return match.id;
	}

	const users = await db.select().from(user);

	if (users.length === 0) {
		throw new Error("No users in the database — sign up first.");
	}
	if (users.length > 1) {
		const emails = users.map((u) => u.email).join(", ");
		throw new Error(
			`Multiple users found — pass an email: pnpm export:category-rules <email>\nAvailable: ${emails}`,
		);
	}

	return users[0].id;
}

async function main() {
	const userId = await resolveUserId();
	const grouped = await getCategoryRulesGrouped(userId);

	console.log(JSON.stringify(grouped, null, 2));
}

main()
	.catch((err) => {
		console.error(err instanceof Error ? err.message : err);
		process.exitCode = 1;
	})
	.finally(() => process.exit());
