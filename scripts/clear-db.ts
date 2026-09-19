import { sql } from "drizzle-orm";
import { db } from "#/db";

async function main() {
	const result = await db.execute<{ tablename: string }>(
		sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`,
	);
	const tables = result.rows.map((r) => r.tablename);

	if (tables.length === 0) {
		console.log("No tables to clear.");
		return;
	}

	const list = tables.map((t) => `"public"."${t}"`).join(", ");
	await db.execute(sql.raw(`TRUNCATE TABLE ${list} RESTART IDENTITY CASCADE`));
	console.log(`Cleared ${tables.length} tables: ${tables.join(", ")}`);
}

main()
	.catch((err) => {
		console.error(err);
		process.exit(1);
	})
	.finally(() => process.exit(0));
