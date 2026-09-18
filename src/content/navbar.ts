import {
	ChartBarIcon,
	HouseIcon,
	type Icon,
	UploadIcon,
	WarningIcon,
} from "@phosphor-icons/react";
import type { LinkProps } from "@tanstack/react-router";
import { linkOptions } from "@tanstack/react-router";
import { m } from "#/paraglide/messages";

export type NavLink = {
	label: string;
	icon: Icon;
	options: LinkProps;
};

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
		label: m.navbar_danger_zone_label(),
		icon: WarningIcon,
		options: linkOptions({
			to: "/settings/danger-zone",
		}),
	},
];
