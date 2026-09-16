import { faker } from "@faker-js/faker";
import { eq } from "drizzle-orm";
import { TRANSACTION_TYPES } from "txcategorizer";
import type { Category, TransactionType } from "txcategorizer";
import { db } from "#/db";
import { insertTransactions } from "#/db/queries/transactions";
import { user } from "#/db/schema";
import type { NewTransactionInput } from "#/lib/schemas/transactions";

const TRANSACTION_COUNT = 50;
const FOREIGN_CURRENCIES = ["USD", "EUR", "GBP", "SEK", "DKK"];

// Which categories a given transaction type can plausibly land in — a card
// purchase (Varekjøp) is never "Inntekt", a salary deposit (Lønn) is never
// "Bolig", a bank fee (Omkostninger) is never "Underholdning", etc.
const TYPE_CATEGORIES: Record<TransactionType, Category[]> = {
	Varekjøp: [
		"Dagligvare",
		"Mat ute",
		"Hjem",
		"Underholdning",
		"Gaming",
		"Netthandel",
		"Helse",
		"Kosmetikk",
		"Klær",
		"Transport",
		"Diverse",
	],
	Visa: [
		"Mat ute",
		"Underholdning",
		"Gaming",
		"Abonnement",
		"Netthandel",
		"Helse",
		"Kosmetikk",
		"Klær",
		"Transport",
		"Diverse",
	],
	Betaling: [
		"Bolig",
		"Boutgifter",
		"Forsikring",
		"Abonnement",
		"Bil",
		"Helse",
		"Kreditt",
		"Diverse",
	],
	Giro: ["Bolig", "Boutgifter", "Forsikring", "Bil", "Kreditt", "Diverse"],
	Overføring: ["Overføring", "Sparing", "Inntekt", "Diverse"],
	Lønn: ["Inntekt"],
	Kontoregulering: ["Overføring", "Sparing"],
	Nedbetaling: ["Bolig", "Bil", "Kreditt", "Sparing"],
	Renter: ["Boutgifter", "Kreditt", "Bolig", "Bil"],
	Omkostninger: ["Boutgifter", "Kreditt", "Diverse"],
	Annet: ["Diverse", "Annet"],
};

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
			`Multiple users found — pass an email: pnpm seed:transactions <email>\nAvailable: ${emails}`,
		);
	}

	return users[0].id;
}

function randomTransaction(): NewTransactionInput {
	const type = faker.helpers.arrayElement(TRANSACTION_TYPES);
	const category = faker.helpers.arrayElement(TYPE_CATEGORIES[type]);

	// A transfer or internal account move can go either direction; every
	// other category/type pairing here is inherently one-directional.
	const isIncome =
		category === "Inntekt" ||
		((type === "Overføring" || type === "Kontoregulering") &&
			faker.datatype.boolean());

	const amount = isIncome
		? faker.number.float({ min: 5000, max: 45000, fractionDigits: 2 })
		: -faker.number.float({ min: 10, max: 3500, fractionDigits: 2 });

	const hasForeignCurrency = faker.datatype.boolean({ probability: 0.15 });

	return {
		date: faker.date
			.between({ from: "2024-01-01", to: new Date() })
			.toISOString()
			.split("T")[0],
		amount,
		merchant: faker.company.name(),
		counterparty: faker.datatype.boolean({ probability: 0.4 })
			? faker.person.fullName()
			: undefined,
		category,
		type,
		valuta: hasForeignCurrency
			? {
					currency: faker.helpers.arrayElement(FOREIGN_CURRENCIES),
					exchangeRate: faker.number.float({
						min: 0.6,
						max: 11,
						fractionDigits: 4,
					}),
				}
			: undefined,
	};
}

async function main() {
	const userId = await resolveUserId();
	const rows = Array.from({ length: TRANSACTION_COUNT }, randomTransaction);

	const { inserted, skipped } = await insertTransactions(userId, rows);

	console.log(
		`Inserted ${inserted.length} transactions for user ${userId}${skipped > 0 ? ` (skipped ${skipped} duplicates)` : ""}`,
	);
}

main()
	.catch((err) => {
		console.error(err instanceof Error ? err.message : err);
		process.exitCode = 1;
	})
	.finally(() => process.exit());
