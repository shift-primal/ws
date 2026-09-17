import { m } from "#/paraglide/messages";

export type CategoryChartContent = {
	title: string;
	description: string;
	emptyText: string;
	otherLabel: string;
	totalLabel: string;
};

export const getCategoryChartContent = (): CategoryChartContent => ({
	title: m.category_chart_title(),
	description: m.category_chart_description(),
	emptyText: m.category_chart_empty(),
	otherLabel: m.category_chart_other(),
	totalLabel: m.category_chart_total(),
});
