const currencyFormatter = new Intl.NumberFormat("nb-NO", {
	style: "currency",
	currency: "NOK",
});

export function formatCurrency(amount: number) {
	return currencyFormatter.format(amount);
}
