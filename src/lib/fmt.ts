import { format as fmtDate, parseISO } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
	style: "currency",
	currency: "NOK",
});

export const fmtCurrency = (amount: number) => currencyFormatter.format(amount);

export const monthLabel = (month: string, pattern: string) =>
	fmtDate(parseISO(`${month}-01`), pattern);
