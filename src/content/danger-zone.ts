import { m } from "#/paraglide/messages";

export const getDangerZoneContent = () => ({
	heading: m.danger_zone_heading(),
	clearTransactionsTitle: m.danger_zone_clear_transactions_title(),
	clearTransactionsDescription: m.danger_zone_clear_transactions_description(),
	clearTransactionsButton: m.danger_zone_clear_transactions_button(),
	confirmTitle: m.danger_zone_confirm_title(),
	confirmDescription: m.danger_zone_confirm_description(),
	confirmButton: m.danger_zone_confirm_button(),
	cancelButton: m.danger_zone_cancel_button(),
	successToastTitle: m.danger_zone_success_title(),
});
