import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { Navbar } from "#/components/layout/navbar";
import { NotFound } from "#/components/layout/not-found";
import { Providers } from "#/components/layout/providers";
import { getLocale } from "#/paraglide/runtime";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	notFoundComponent: NotFound,
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()} suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>

			<body className="overflow-hidden">
				<div className="fixed inset-0 flex flex-col">
					<Providers>
						<Navbar />
						<main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
					</Providers>
				</div>
				<Scripts />
			</body>
		</html>
	);
}
