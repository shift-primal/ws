import { m } from "#/paraglide/messages";

export type TransactionsTableContent = {
	title: string;
	emptyText: string;
};

export const getTransactionsTableContent = (): TransactionsTableContent => ({
	title: m.transactions_table_title(),
	emptyText: m.transactions_table_empty(),
});

export type TransactionsColumnLabels = {
	date: string;
	merchant: string;
	category: string;
	type: string;
	amount: string;
};

export const getTransactionsColumnLabels = (): TransactionsColumnLabels => ({
	date: m.transactions_column_date(),
	merchant: m.transactions_column_merchant(),
	category: m.transactions_column_category(),
	type: m.transactions_column_type(),
	amount: m.transactions_column_amount(),
});

export const getDeleteColumnContent = () => ({
	srHeader: m.transactions_delete_column_sr(),
});

// Not translatable — plain pagination config, not user-facing copy.
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const getTransactionsTableFooterContent = () => ({
	rowsPerPage: m.transactions_footer_rows_per_page(),
	previous: m.transactions_footer_previous(),
	next: m.transactions_footer_next(),
	pageSummary: (page: number, totalPages: number, totalResults: number) =>
		m.transactions_footer_page_summary({ page, totalPages, totalResults }),
});

export const getDeleteRowButtonContent = () => ({
	confirmTitle: m.transactions_delete_confirm_title(),
	confirmDescription: m.transactions_delete_confirm_description(),
	confirmButton: m.transactions_delete_confirm_button(),
	successToastTitle: m.transactions_delete_success_title(),
});

export const getCategoryCellContent = () => ({
	successToastTitle: m.transactions_category_update_success_title(),
});

export const getExcludeHintContent = () => ({
	text: m.transactions_exclude_hint(),
	touchText: m.transactions_exclude_hint_touch(),
});
