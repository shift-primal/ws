import type { Bank } from "txcategorizer";
import { m } from "#/paraglide/messages";

export const getBankLabels = (): Record<Bank, string> => ({
	dnb: m.import_bank_dnb(),
	valle: m.import_bank_valle(),
});

export const getDropzoneContent = () => ({
	title: m.import_dropzone_title(),
	description: m.import_dropzone_description(),
	dropText: m.import_dropzone_drop_text(),
	browseText: m.import_dropzone_browse_text(),
	emptyText: m.import_dropzone_empty(),
});

export const getPreviewTableContent = () => ({
	duplicateBadge: m.import_preview_duplicate_badge(),
	moreRows: (count: number) => m.import_preview_more_rows({ count }),
});

export const getConfirmImportContent = () => ({
	title: m.import_confirm_title(),
	cancelButton: m.import_confirm_cancel(),
	confirmButton: m.import_confirm_button(),
	transactionCount: (count: number) =>
		count === 1
			? m.import_confirm_transaction_count_singular({ count })
			: m.import_confirm_transaction_count_plural({ count }),
	duplicatesSkipped: (count: number) =>
		count === 1
			? m.import_confirm_duplicates_skipped_singular({ count })
			: m.import_confirm_duplicates_skipped_plural({ count }),
});

export const getUploadFormContent = () => ({
	legend: m.import_form_legend(),
	description: m.import_form_description(),
	fileAccept: m.import_form_file_accept(),
	bankLabel: m.import_form_bank_label(),
	bankPlaceholder: m.import_form_bank_placeholder(),
	fileRequiredError: m.import_form_file_required_error(),
	bankRequiredError: m.import_form_bank_required_error(),
	checking: m.import_form_checking(),
	submit: m.import_form_submit(),
	importCompleteTitle: m.import_toast_import_complete_title(),
	importedSummary: (insertedCount: number, skippedCount: number) =>
		skippedCount > 0
			? skippedCount === 1
				? m.import_toast_imported_skipped_singular({
						inserted: insertedCount,
						skipped: skippedCount,
					})
				: m.import_toast_imported_skipped_plural({
						inserted: insertedCount,
						skipped: skippedCount,
					})
			: insertedCount === 1
				? m.import_toast_imported_singular({ count: insertedCount })
				: m.import_toast_imported_plural({ count: insertedCount }),
	importFailedTitle: m.import_toast_import_failed_title(),
	duplicateCheckFailedTitle: m.import_toast_duplicate_check_failed_title(),
	noTransactionsTitle: m.import_toast_no_transactions_title(),
	noTransactionsDescription: m.import_toast_no_transactions_description(),
	unsupportedFileTitle: m.import_toast_unsupported_file_title(),
	unsupportedFileDescription: m.import_toast_unsupported_file_description(),
});
