export type MonthlyChartContent = {
	title: string;
	description: string;
	emptyText: string;
	incomeLabel: string;
	expensesLabel: string;
};

export const MONTHLY_CHART_CONTENT: MonthlyChartContent = {
	title: "Monthly trend",
	description: "Income vs. expenses over time",
	emptyText: "No data for the current filters.",
	incomeLabel: "Income",
	expensesLabel: "Expenses",
};
