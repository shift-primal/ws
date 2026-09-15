import { ensureSession } from "@better-auth-ui/core";
import { ensureSessionServer } from "@better-auth-ui/core/server";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { PageContainer } from "#/components/layout/page-container";
import { auth } from "#/lib/auth/auth";
import { authClient } from "#/lib/auth/auth-client";

export const Route = createFileRoute("/_authenticated")({
	async beforeLoad({ context: { queryClient }, location }) {
		const ensureSessionIso = createIsomorphicFn()
			.server(() =>
				ensureSessionServer(queryClient, auth, {
					headers: getRequestHeaders(),
				}),
			)
			.client(() => ensureSession(queryClient, authClient));

		const session = await ensureSessionIso();

		if (!session) {
			throw redirect({
				to: "/auth/$path",
				params: { path: "sign-in" },
				search: { redirectTo: location.href },
			});
		}

		return { session };
	},
	component: () => (
		<PageContainer>
			<Outlet />
		</PageContainer>
	),
});
