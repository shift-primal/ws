import { MoonIcon, SunIcon } from "@phosphor-icons/react";
import { Button } from "#/components/shadcn/ui/button";
import { useThemeTransition } from "#/lib/hooks/use-theme-transition";

export const ThemeSwitcher = () => {
	const { isDark, toggle } = useThemeTransition();

	return (
		<Button onClick={toggle} variant="ghost">
			{isDark ? <MoonIcon /> : <SunIcon />}
		</Button>
	);
};
