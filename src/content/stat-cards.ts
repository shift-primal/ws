import { fmtCurrency, fmtCurrencyCompact } from "#/lib/fmt";
import { signColor } from "#/lib/utils";
import { m } from "#/paraglide/messages";

export type StatCardProps = {
	title: string;
	description: string;
	content: string;
	contentCompact?: string;
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
			contentCompact: fmtCurrencyCompact(net),
			color: signColor(net),
		},
		{
			title: m.stat_cards_income_title(),
			description: m.stat_cards_income_description(),
			content: fmtCurrency(totalIn),
			contentCompact: fmtCurrencyCompact(totalIn),
			color: "success",
		},
		{
			title: m.stat_cards_expenses_title(),
			description: m.stat_cards_expenses_description(),
			content: fmtCurrency(totalOut),
			contentCompact: fmtCurrencyCompact(totalOut),
			color: "destructive",
		},
		{
			title: m.stat_cards_transactions_title(),
			description: m.stat_cards_transactions_description(),
			content: totalResults.toString(),
		},
	];
};
