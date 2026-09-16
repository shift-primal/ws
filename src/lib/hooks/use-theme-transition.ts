import { useTheme } from "next-themes";
import { useCallback, useEffect, useRef, useState } from "react";

export function useThemeTransition() {
	const { resolvedTheme, setTheme } = useTheme();
	const [mounted, setMounted] = useState(false);
	const rafRef = useRef<number | null>(null);

	useEffect(() => {
		setMounted(true);
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
		};
	}, []);

	const isDark = mounted && resolvedTheme === "dark";

	const toggle = useCallback(() => {
		if (rafRef.current) cancelAnimationFrame(rafRef.current);

		const root = document.documentElement;
		root.classList.add("no-transitions");

		setTheme(isDark ? "light" : "dark");

		rafRef.current = requestAnimationFrame(() => {
			rafRef.current = requestAnimationFrame(() => {
				root.classList.remove("no-transitions");
				rafRef.current = null;
			});
		});
	}, [isDark, setTheme]);

	return {
		isDark,
		toggle,
	};
}
