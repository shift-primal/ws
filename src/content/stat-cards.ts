import { fmtCurrency } from "#/lib/fmt";
import { signColor } from "#/lib/utils";

export type StatCardProps = {
	title: string;
	description: string;
	content: string;
	color?: "success" | "destructive";
};

export const getStatCardsContent = ({
	totalIn,
	totalOut,
	totalResults,
}: {
	totalIn: number;
	totalOut: number;
	totalResults: number;
}): StatCardProps[] => {
	const net = totalIn + totalOut;

	return [
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
};
