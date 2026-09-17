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

export const NAV_LINKS: NavLink[] = [
	{
		label: "Home",
		icon: HouseIcon,
		options: linkOptions({
			to: "/",
		}),
	},
	{
		label: "Dashboard",
		icon: ChartBarIcon,
		options: linkOptions({
			to: "/dashboard",
		}),
	},
	{
		label: "Import",
		icon: UploadIcon,
		options: linkOptions({
			to: "/import",
		}),
	},
	{
		label: "Dev",
		icon: WrenchIcon,
		options: linkOptions({
			to: "/dev",
		}),
	},
];

export const CONTACT_LINKS: ExternalLink[] = [
	{
		label: "GitHub",
		icon: GithubLogoIcon,
		href: "https://github.com/shift-primal",
	},
	{
		label: "Email",
		icon: EnvelopeIcon,
		href: "mailto:kasper@haugestol.com",
	},
];
