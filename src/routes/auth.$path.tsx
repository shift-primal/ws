import { ensureSession, viewPaths } from "@better-auth-ui/core";
import { ensureSessionServer } from "@better-auth-ui/core/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { Auth } from "#/components/shadcn/auth/auth";
import { auth } from "#/lib/auth/auth";
import { authClient } from "#/lib/auth/auth-client";

const validAuthPathSegments = new Set([...Object.values(viewPaths.auth)]);

// Callback, reset-password, verify-email, sign-out etc. must still work for
// an already-signed-in visitor (they're often reached from an emailed link
// or an OAuth redirect). Only sign-in/sign-up are pointless once signed in.
const redirectIfAuthenticatedPaths = new Set([
	viewPaths.auth.signIn,
	viewPaths.auth.signUp,
]);

export const Route = createFileRoute("/auth/$path")({
	async beforeLoad({ params: { path }, context: { queryClient } }) {
		if (!validAuthPathSegments.has(path)) {
			throw redirect({ to: "/" });
		}

		if (redirectIfAuthenticatedPaths.has(path)) {
			const ensureSessionIso = createIsomorphicFn()
				.server(() =>
					ensureSessionServer(queryClient, auth, {
						headers: getRequestHeaders(),
					}),
				)
				.client(() => ensureSession(queryClient, authClient));

			const session = await ensureSessionIso();
			if (session) {
				throw redirect({ to: "/dashboard" });
			}
		}
	},
	component: AuthPage,
});

function AuthPage() {
	const { path } = Route.useParams();

	return (
		<div className="flex justify-center my-auto p-4 md:p-6">
			<Auth path={path} />
		</div>
	);
}
