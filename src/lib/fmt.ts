import { format as fmtDate, parseISO } from "date-fns";

const currencyFormatter = new Intl.NumberFormat("nb-NO", {
	style: "currency",
	currency: "NOK",
});

export const fmtCurrency = (amount: number) => currencyFormatter.format(amount);

export const monthLabel = (month: string, pattern: string) =>
	fmtDate(parseISO(`${month}-01`), pattern);

export const fmtShortDate = (date: string) =>
	fmtDate(parseISO(date), "dd.MM.yy");

export const fmtCurrencyCompact = (amount: number) => {
	const sign = amount < 0 ? "-" : "";
	const abs = Math.abs(amount);

	if (abs >= 1_000_000) {
		return `${sign}${(abs / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
	}
	if (abs >= 100_000) {
		return `${sign}${Math.round(abs / 1_000)}K`;
	}
	if (abs >= 1_000) {
		return `${sign}${(abs / 1_000).toFixed(1).replace(".", ",")}K`;
	}
	return `${sign}${Math.round(abs)}`;
};

export const fmtExchangeRate = (rate: string) => Number(rate).toFixed(2);

export const fmtFileSize = (bytes: number) => {
	if (bytes === 0) return "0 B";
	const units = ["B", "KB", "MB", "GB"];
	const exponent = Math.min(
		Math.floor(Math.log(bytes) / Math.log(1024)),
		units.length - 1,
	);
	const value = bytes / 1024 ** exponent;
	return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
};
