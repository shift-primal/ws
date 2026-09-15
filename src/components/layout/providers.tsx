import { AuthProvider } from "@better-auth-ui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { TooltipProvider } from "#/components/shadcn/ui/tooltip";
import { authClient } from "#/lib/auth/auth-client";

export const Providers = ({ children }: { children: ReactNode }) => {
	const navigate = useNavigate();

	return (
		<TooltipProvider>
			<AuthProvider
				authClient={authClient}
				redirectTo="/dashboard"
				navigate={navigate}
				Link={({ href, ...props }) => <Link to={href} {...props} />}
			>
				{children}
			</AuthProvider>
		</TooltipProvider>
	);
};
