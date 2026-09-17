import { Button } from "#/components/shadcn/ui/button";
import { m } from "#/paraglide/messages";
import { getLocale, setLocale } from "#/paraglide/runtime";

export const LanguageSwitcher = () => {
	const currentLocale = getLocale();
	const nextLocale = currentLocale === "en" ? "no" : "en";

	return (
		<Button
			type="button"
			variant="ghost"
			onClick={() => setLocale(nextLocale)}
			aria-label={
				nextLocale === "no"
					? m.language_switch_to_norwegian_aria()
					: m.language_switch_to_english_aria()
			}
		>
			{currentLocale.toUpperCase()}
		</Button>
	);
};
