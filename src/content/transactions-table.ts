export type TransactionsTableContent = {
	title: string;
	emptyText: string;
};

export const TRANSACTIONS_TABLE_CONTENT: TransactionsTableContent = {
	title: "Transactions",
	emptyText: "No transactions.",
};

export type TransactionsColumnLabels = {
	date: string;
	merchant: string;
	category: string;
	type: string;
	amount: string;
};

export const TRANSACTIONS_COLUMN_LABELS: TransactionsColumnLabels = {
	date: "Date",
	merchant: "Merchant",
	category: "Category",
	type: "Type",
	amount: "Amount",
};

export const DELETE_COLUMN_CONTENT = {
	srHeader: "Delete row",
};

export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export const TRANSACTIONS_TABLE_FOOTER_CONTENT = {
	rowsPerPage: "Rows per page",
	previous: "Previous",
	next: "Next",
	pageSummary: (page: number, totalPages: number, totalResults: number) =>
		`Page ${page} of ${totalPages} · ${totalResults} total`,
};

export const DELETE_ROW_BUTTON_CONTENT = {
	confirmTitle: "Are you sure you wish to delete this row?",
	confirmDescription: "This action can not be undone!",
	confirmButton: "Delete",
	successToastTitle: "Success!",
};
