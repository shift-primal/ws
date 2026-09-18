import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { AuthProvider } from "#/components/shadcn/auth/auth-provider";
import { Toaster } from "#/components/shadcn/ui/toast";
import { TooltipProvider } from "#/components/shadcn/ui/tooltip";
import { authClient } from "#/lib/auth/auth-client";
import { authLocaleNo } from "#/lib/auth/auth-locale-no";
import { getLocale } from "#/paraglide/runtime";

export const Providers = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	return (
		<ThemeProvider attribute="class">
			<TooltipProvider>
				<AuthProvider
					authClient={authClient}
					redirectTo="/dashboard"
					navigate={navigate}
					Link={({ href, ...props }) => <Link to={href} {...props} />}
					locale={getLocale() === "no" ? authLocaleNo : undefined}
				>
					{children}
					<Toaster />
				</AuthProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};
