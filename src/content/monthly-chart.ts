import { m } from "#/paraglide/messages";

export type MonthlyChartContent = {
	title: string;
	description: string;
	emptyText: string;
	incomeLabel: string;
	expensesLabel: string;
};

export const getMonthlyChartContent = (): MonthlyChartContent => ({
	title: m.monthly_chart_title(),
	description: m.monthly_chart_description(),
	emptyText: m.monthly_chart_empty(),
	incomeLabel: m.monthly_chart_income(),
	expensesLabel: m.monthly_chart_expenses(),
});
