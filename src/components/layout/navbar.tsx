import { Link } from "@tanstack/react-router";
import { ThemeSwitcher } from "#/components/layout/theme-switcher";
import { UserButton } from "#/components/shadcn/auth/user/user-button";
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "#/components/shadcn/ui/navigation-menu";
import { CONTACT_LINKS, NAV_LINKS } from "#/content";

export const Navbar = () => {
	return (
		<NavigationMenu className="flex-none shrink-0 w-full max-w-full border-b-2 py-2 px-4">
			<NavigationMenuList className="gap-2">
				{NAV_LINKS.map(({ label, icon: LinkIcon, options }) => (
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
						{CONTACT_LINKS.map(({ label, icon: LinkIcon, href }) => (
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
				<NavigationMenuItem>
					<ThemeSwitcher />
				</NavigationMenuItem>
				<NavigationMenuItem className="flex items-center justify-center">
					<UserButton size="icon" />
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
