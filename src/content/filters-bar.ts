import { m } from "#/paraglide/messages";

export const getAmountRangeFilterContent = () => ({
	label: m.filter_amount_label(),
});

export const getCategoryFilterContent = () => ({
	label: m.filter_category_label(),
	anyLabel: m.filter_category_any(),
	countLabel: (count: number) => m.filter_category_count({ count }),
});

export const getDateRangeFilterContent = () => ({
	label: m.filter_date_range_label(),
	allTimeLabel: m.filter_date_range_all_time(),
	clearAriaLabel: m.filter_date_range_clear_aria(),
});

export const getMerchantFilterContent = () => ({
	label: m.filter_merchant_label(),
	placeholder: m.filter_merchant_placeholder(),
});

export const getTypeFilterContent = () => ({
	label: m.filter_type_label(),
	anyLabel: m.filter_type_any(),
	countLabel: (count: number) => m.filter_type_count({ count }),
});
