import { m } from "#/paraglide/messages";

export const getHomeContent = () => ({
	description: m.home_description(),
	dashboardButton: m.home_dashboard_button(),
	demoButton: m.home_demo_button(),
	demoHint: m.home_demo_hint(),
});
