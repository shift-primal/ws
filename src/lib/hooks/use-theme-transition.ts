import { useTheme } from "next-themes";
import { useCallback, useEffect, useState } from "react";

export function useThemeTransition() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => setMounted(true), []);

	const isDark = mounted && resolvedTheme === "dark";

	const toggle = useCallback(() => {
		setTheme(isDark ? "light" : "dark");
	}, [isDark, setTheme]);

	return {
		isDark,
		toggle,
	};
}
