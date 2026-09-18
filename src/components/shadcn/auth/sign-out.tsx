

import { useAuth, useSignOut } from "@better-auth-ui/react";
import { useEffect, useRef } from "react";
import { Spinner } from "#/components/shadcn/ui/spinner.tsx";
import { cn } from "#/lib/utils";

export type SignOutProps = {
	className?: string;
};

/**
 * Signs the current user out on mount and renders a centered spinner while the operation completes.
 *
 * @param className - Optional additional class names appended to the root element
 * @returns The spinner shown during sign-out
 */
export function SignOut({ className }: SignOutProps) {
	const { authClient, basePaths, viewPaths } = useAuth();

	const { mutate: signOut } = useSignOut(authClient, {
		// A hard navigation, not `navigate()`. Sign-out's mutation meta removes
		// the cached session query outright (rather than invalidating it), which
		// destroys the query object out from under any component with an active
		// session observer — e.g. the navbar's UserButton. That observer only
		// resyncs to the cache on its own next re-render, which nothing here
		// triggers, so it keeps rendering the stale signed-in user indefinitely.
		// A full reload is the reliable fix (and matches the user-facing "hard
		// refresh clears it" workaround) since it can't be overridden through
		// the public sign-out API (its mutation `meta` is intentionally omitted
		// from the options type).
		onError: () => {
			window.location.assign(`${basePaths.auth}/${viewPaths.auth.signIn}`);
		},
		onSuccess: () => {
			window.location.assign(`${basePaths.auth}/${viewPaths.auth.signIn}`);
		},
	});

	const hasSignedOut = useRef(false);

	useEffect(() => {
		if (hasSignedOut.current) return;
		hasSignedOut.current = true;

		signOut();
	}, [signOut]);

	return <Spinner className={cn("mx-auto my-auto", className)} />;
}
