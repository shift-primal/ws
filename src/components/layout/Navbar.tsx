import {
	ChartBarIcon,
	EnvelopeIcon,
	GithubLogoIcon,
	HouseIcon,
	type Icon,
	UploadIcon,
} from "@phosphor-icons/react";
import { Link, type LinkProps, linkOptions } from "@tanstack/react-router";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "#/components/shadcn/navigation-menu";

type NavLink = {
	label: string;
	icon: Icon;
	options: LinkProps;
};

type ExternalLink = {
	label: string;
	icon: Icon;
	href: string;
};

const navLinks: NavLink[] = [
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
];

const contactLinks: ExternalLink[] = [
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

export const Navbar = () => {
	return (
		<NavigationMenu className="flex-none shrink-0 w-full max-w-full border-b-2 py-2 px-4">
			<NavigationMenuList className="gap-2">
				{navLinks.map(({ label, icon: LinkIcon, options }) => (
					<NavigationMenuItem key={label}>
						<NavigationMenuLink
							className={navigationMenuTriggerStyle()}
							aria-label={label}
							render={(props) => (
								<Link {...options} {...props}>
									<LinkIcon />
								</Link>
							)}
						/>
					</NavigationMenuItem>
				))}

				<NavigationMenuItem className="ml-auto">
					<NavigationMenuTrigger>Kontakt</NavigationMenuTrigger>
					<NavigationMenuContent className="flex gap-2">
						{contactLinks.map(({ label, icon: LinkIcon, href }) => (
							<NavigationMenuLink
								key={label}
								aria-label={label}
								render={(props) => (
									<a href={href} target="_blank" rel="noreferrer" {...props}>
										<LinkIcon />
									</a>
								)}
							/>
						))}
					</NavigationMenuContent>
				</NavigationMenuItem>
				<NavigationMenuItem className="flex items-center justify-center">
					<UserButton />
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
