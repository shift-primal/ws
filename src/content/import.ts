import type { Bank } from "txcategorizer";

export const BANK_LABELS: Record<Bank, string> = {
	dnb: "DNB",
	valle: "Valle",
};

export const DROPZONE_CONTENT = {
	title: "Upload files",
	description: "Drag and drop files or click to browse",
	dropText: "Drop files here",
	browseText: "or click to browse from your device",
	emptyText: "No files uploaded yet",
};

export const PREVIEW_TABLE_CONTENT = {
	duplicateBadge: "Duplicate",
	moreRows: (count: number) => `and ${count} more…`,
};

export const CONFIRM_IMPORT_CONTENT = {
	title: "Confirm import",
	cancelButton: "Cancel",
	confirmButton: "Confirm import",
	transactionCount: (count: number) =>
		`${count} transaction${count === 1 ? "" : "s"}`,
	duplicatesSkipped: (count: number) =>
		`${count} duplicate${count === 1 ? "" : "s"} skipped`,
};

export const UPLOAD_FORM_CONTENT = {
	legend: "Import transactions",
	description: "Import your transactions from a file",
	fileAccept: "Accepts .csv and .txt files",
	bankLabel: "Bank",
	bankPlaceholder: "Select your bank",
	fileRequiredError: "Select a file to import",
	bankRequiredError: "Select a bank",
	checking: "Checking…",
	submit: "Preview import",
	importCompleteTitle: "Import complete",
	importedSummary: (insertedCount: number, skippedCount: number) =>
		skippedCount > 0
			? `Imported ${insertedCount}, skipped ${skippedCount} duplicate${skippedCount === 1 ? "" : "s"}.`
			: `Imported ${insertedCount} transaction${insertedCount === 1 ? "" : "s"}.`,
	importFailedTitle: "Import failed",
	duplicateCheckFailedTitle: "Couldn't check for duplicates",
	noTransactionsTitle: "No transactions found",
	noTransactionsDescription:
		"Couldn't find any transactions in this file. Check that it's a valid export from the selected bank.",
	unsupportedFileTitle: "Unsupported file",
	unsupportedFileDescription: "Only .csv and .txt files are accepted.",
};
