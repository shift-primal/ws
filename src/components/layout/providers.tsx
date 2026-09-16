import { AuthProvider } from "@better-auth-ui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { Toaster } from "#/components/shadcn/ui/toast";
import { TooltipProvider } from "#/components/shadcn/ui/tooltip";
import { authClient } from "#/lib/auth/auth-client";

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
				>
					{children}
					<Toaster />
				</AuthProvider>
			</TooltipProvider>
		</ThemeProvider>
	);
};
