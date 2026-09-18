import { EnvelopeIcon, GithubLogoIcon, type Icon } from "@phosphor-icons/react";
import { m } from "#/paraglide/messages";

export type ExternalLink = {
	label: string;
	icon: Icon;
	href: string;
};

export const getFooterCopyright = (year: number): string =>
	m.footer_copyright({ year });

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
