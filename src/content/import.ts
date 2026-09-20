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

export const getImportTutorialContent = () => ({
	trigger: m.import_tutorial_trigger(),
	title: m.import_tutorial_title(),
	description: m.import_tutorial_description(),
	stepCounter: (current: number, total: number) =>
		m.import_tutorial_step_counter({ current, total }),
	previous: m.import_tutorial_previous(),
	next: m.import_tutorial_next(),
	done: m.import_tutorial_done(),
	steps: [
		{
			title: m.import_tutorial_step_1_title(),
			description: m.import_tutorial_step_1_description(),
			link: {
				label: m.import_tutorial_step_1_link(),
				href: "https://www.dnb.no/dagligbank/nettbank/fullversjon",
			},
		},
		{
			title: m.import_tutorial_step_2_title(),
			description: m.import_tutorial_step_2_description(),
		},
		{
			title: m.import_tutorial_step_3_title(),
			description: m.import_tutorial_step_3_description(),
		},
		{
			title: m.import_tutorial_step_4_title(),
			description: m.import_tutorial_step_4_description(),
		},
		{
			title: m.import_tutorial_step_5_title(),
			description: m.import_tutorial_step_5_description(),
		},
		{
			title: m.import_tutorial_step_6_title(),
			description: m.import_tutorial_step_6_description(),
		},
		{
			title: m.import_tutorial_step_7_title(),
			description: m.import_tutorial_step_7_description(),
		},
		{
			title: m.import_tutorial_step_8_title(),
			description: m.import_tutorial_step_8_description(),
		},
		{
			title: m.import_tutorial_step_9_title(),
			description: m.import_tutorial_step_9_description(),
		},
		{
			title: m.import_tutorial_step_10_title(),
			description: m.import_tutorial_step_10_description(),
		},
		{
			title: m.import_tutorial_step_11_title(),
			description: m.import_tutorial_step_11_description(),
		},
	],
});
