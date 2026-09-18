import { m } from "#/paraglide/messages";

export const getDemoAccountsContent = () => ({
	heading: m.demo_accounts_heading(),
	description: m.demo_accounts_description(),
	accountLabel: (number: number) => m.demo_accounts_account_label({ number }),
	switcherTrigger: m.demo_accounts_switcher_trigger(),
	signInErrorTitle: m.demo_accounts_sign_in_error_title(),
	settingsLockedTitle: m.demo_accounts_settings_locked_title(),
	settingsLockedDescription: m.demo_accounts_settings_locked_description(),
});
