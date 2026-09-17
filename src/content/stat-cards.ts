import { fmtCurrency } from "#/lib/fmt";
import { signColor } from "#/lib/utils";
import { m } from "#/paraglide/messages";

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
			title: m.stat_cards_net_title(),
			description: m.stat_cards_net_description(),
			content: fmtCurrency(net),
			color: signColor(net),
		},
		{
			title: m.stat_cards_income_title(),
			description: m.stat_cards_income_description(),
			content: fmtCurrency(totalIn),
			color: "success",
		},
		{
			title: m.stat_cards_expenses_title(),
			description: m.stat_cards_expenses_description(),
			content: fmtCurrency(totalOut),
			color: "destructive",
		},
		{
			title: m.stat_cards_transactions_title(),
			description: m.stat_cards_transactions_description(),
			content: totalResults.toString(),
		},
	];
};
