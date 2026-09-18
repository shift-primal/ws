import { Link } from "@tanstack/react-router";
import { LanguageSwitcher } from "#/components/layout/language-switcher";
import { ThemeSwitcher } from "#/components/layout/theme-switcher";
import { DemoAccountMenu } from "#/components/shadcn/auth/user/demo-account-menu";
import { UserButton } from "#/components/shadcn/auth/user/user-button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from "#/components/shadcn/ui/navigation-menu";
import { getNavLinks } from "#/content";

export const Navbar = () => {
	return (
		<NavigationMenu className="flex-none w-full max-w-full border-b-2 py-2 px-4 justify-between">
			<NavigationMenuList className="gap-2 flex-0">
				{getNavLinks().map(({ label, icon: LinkIcon, options }) => (
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
			</NavigationMenuList>

			<NavigationMenuList className="gap-2 flex-0">
				<NavigationMenuItem>
					<LanguageSwitcher />
				</NavigationMenuItem>
				<NavigationMenuItem>
					<ThemeSwitcher />
				</NavigationMenuItem>
				<NavigationMenuItem className="flex items-center justify-center">
					<UserButton
						size="icon"
						links={[<DemoAccountMenu key="demo-accounts" />]}
					/>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
};
