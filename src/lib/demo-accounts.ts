export type DemoAccount = {
	id: string;
	email: string;
	password: string;
	name: string;
};

// Shared between the demo seed script and the client-side demo login
// buttons — the password is intentionally public, these accounts exist
// so visitors can explore the app without signing up.
export const DEMO_ACCOUNTS: DemoAccount[] = Array.from(
	{ length: 5 },
	(_, i) => {
		const n = i + 1;
		return {
			id: `demo-${n}`,
			email: `demo${n}@wastescope.app`,
			password: "wastescope-demo",
			name: `Demo ${n}`,
		};
	},
);

// The `id` field above is never the real DB id — the seed script creates
// these via auth.api.signUpEmail(), which assigns its own generated id, so
// `id` is unused for identification. `email` is what's actually unique and
// explicitly set, so it's the only reliable way to recognize a demo account.
const DEMO_ACCOUNT_EMAILS = new Set(
	DEMO_ACCOUNTS.map((account) => account.email),
);

export const isDemoAccountEmail = (email: string) =>
	DEMO_ACCOUNT_EMAILS.has(email);
