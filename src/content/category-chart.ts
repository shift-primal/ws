export type CategoryChartContent = {
	title: string;
	description: string;
	emptyText: string;
	otherLabel: string;
	totalLabel: string;
};

export const CATEGORY_CHART_CONTENT: CategoryChartContent = {
	title: "By category",
	description: "Share of spending, will only show expenses",
	emptyText: "No data for the current filters.",
	otherLabel: "Other",
	totalLabel: "Total",
};
