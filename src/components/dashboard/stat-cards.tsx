import { StatCard } from "#/components/dashboard/stat-cards/stat-card";
import { fmtCurrency } from "#/lib/fmt";
import { signColor } from "#/lib/utils";

export type StatCardProps = {
	title: string;
	description: string;
	content: string;
	color?: "success" | "destructive";
};

export function StatCards({
	totalIn,
	totalOut,
	totalResults,
}: {
	totalIn: number;
	totalOut: number;
	totalResults: number;
}) {
	const net = totalIn + totalOut;

	const STAT_CARDS_CONTENT: StatCardProps[] = [
		{
			title: "Net",
			description: "Total net (income - expenses)",
			content: fmtCurrency(net),
			color: signColor(net),
		},
		{
			title: "Income",
			description: "Total income",
			content: fmtCurrency(totalIn),
			color: "success",
		},
		{
			title: "Expenses",
			description: "Total expenses",
			content: fmtCurrency(totalOut),
			color: "destructive",
		},
		{
			title: "Transactions",
			description: "Total number of transactions",
			content: totalResults.toString(),
		},
	];

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{STAT_CARDS_CONTENT.map((c) => (
				<StatCard
					key={c.title}
					title={c.title}
					description={c.description}
					content={c.content}
					color={c.color}
				/>
			))}
		</div>
	);
}
