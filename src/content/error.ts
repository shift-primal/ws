import { m } from "#/paraglide/messages";

export const getErrorContent = () => ({
	heading: m.error_heading(),
	message: m.error_message(),
	retryButton: m.error_retry_button(),
	homeLink: m.error_home_link(),
});

export const getUnauthorizedErrorContent = () => ({
	heading: m.error_unauthorized_heading(),
	message: m.error_unauthorized_message(),
	signInLink: m.error_unauthorized_sign_in_link(),
});
