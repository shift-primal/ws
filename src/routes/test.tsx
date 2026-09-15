import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "#/lib/auth/auth-client";
import {
	clearTransactions,
	fetchTransactions,
	importTransactions,
} from "#/server/functions/transactions";

export const Route = createFileRoute("/test")({
	component: RouteComponent,
});

function RouteComponent() {
	const fakeLogin = () => {
		authClient.signIn
			.email({ email: "test@test.com", password: "password123" })
			.then((r) => {
				if (r.error?.status === 401) {
					return authClient.signUp.email({
						email: "test@test.com",
						password: "password123",
						name: "Test User",
					});
				}
				return r;
			})
			.then((r) => console.log("logged in:", r))
			.catch((e) => console.error("login err:", e));
	};

	const runImport = () => {
		importTransactions({
			data: [
				{
					date: "2026-06-10",
					amount: -99,
					merchant: "KIWI",
					type: "Varekjøp",
					category: "Dagligvare",
				},
				{
					date: "2026-06-11",
					amount: -50,
					merchant: "STEAM",
					type: "Visa",
					category: "Gaming",
					valuta: {
						currency: "USD",
						exchangeRate: 10.85,
					},
				},
			],
		})
			.then((res) => console.log("imported:", res))
			.catch((err) => console.error("import error:", err));
	};

	const testRead = () => {
		fetchTransactions({
			data: {},
		})
			.then((r) => console.log("read ok:", r.totalResults))
			.catch((e) => console.error("read err:", e));
	};

	const testClearTransactions = () => {
		clearTransactions()
			.then((r) => console.log("cleared transactions: ", r))
			.catch((e) => console.error("clear err:", e));
	};

	return (
		<div>
			<div className="flex items-center gap-2">
				<button className="border bg-green-400" type="button" onClick={fakeLogin}>
					Fake login
				</button>
				<button
					className="border bg-blue-400"
					type="button"
					onClick={runImport}
				>
					Run import
				</button>
				<button className="border bg-blue-400" type="button" onClick={testRead}>
					Test read
				</button>
				<button
					className="border bg-blue-400"
					type="button"
					onClick={testClearTransactions}
				>
					Clear
				</button>
			</div>
		</div>
	);
}
