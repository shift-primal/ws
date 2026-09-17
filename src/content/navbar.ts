import {
	ChartBarIcon,
	EnvelopeIcon,
	GithubLogoIcon,
	HouseIcon,
	type Icon,
	UploadIcon,
	WrenchIcon,
} from "@phosphor-icons/react";
import type { LinkProps } from "@tanstack/react-router";
import { linkOptions } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";

export type NavLink = {
	label: string;
	icon: Icon;
	options: LinkProps;
};

export type ExternalLink = {
	label: string;
	icon: Icon;
	href: string;
};

// Wrapped in functions (rather than module-level constants) so the
// paraglide message calls re-resolve the active locale on every call,
// instead of being frozen to whichever locale was active when this
// module first loaded.
export const getNavLinks = (): NavLink[] => [
	{
		label: m.navbar_home_label(),
		icon: HouseIcon,
		options: linkOptions({
			to: "/",
		}),
	},
	{
		label: m.navbar_dashboard_label(),
		icon: ChartBarIcon,
		options: linkOptions({
			to: "/dashboard",
		}),
	},
	{
		label: m.navbar_import_label(),
		icon: UploadIcon,
		options: linkOptions({
			to: "/import",
		}),
	},
	{
		label: m.navbar_dev_label(),
		icon: WrenchIcon,
		options: linkOptions({
			to: "/dev",
		}),
	},
];

export const getContactLinks = (): ExternalLink[] => [
	{
		label: m.navbar_github_label(),
		icon: GithubLogoIcon,
		href: "https://github.com/shift-primal",
	},
	{
		label: m.navbar_email_label(),
		icon: EnvelopeIcon,
		href: "mailto:kasper@haugestol.com",
	},
];

export const getNavbarContactTrigger = (): string => m.navbar_contact_trigger();
