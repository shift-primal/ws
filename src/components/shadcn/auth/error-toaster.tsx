import {
	authMutationKeys,
	authQueryKeys,
	getAuthErrorPresentation,
	isPasswordCompromisedError,
} from "@better-auth-ui/core";
import { oneTapMutationKeys } from "@better-auth-ui/core/plugins/one-tap";
import {
	matchMutation,
	matchQuery,
	useQueryClient,
} from "@tanstack/react-query";
import type { BetterFetchError } from "better-auth/react";
import { useEffect } from "react";
import { toast } from "#/components/shadcn/ui/toast";
import { getDemoAccountsContent } from "#/content";

// better-auth error messages come straight from the server in English —
// this code is thrown by our own hook (#/lib/auth/auth.ts), so we swap in
// the already-localized copy instead of showing the raw message.
function addAuthErrorToast(err: BetterFetchError) {
	if (err.error?.code === "DEMO_ACCOUNT_FORBIDDEN") {
		const content = getDemoAccountsContent();
		toast.add({
			type: "error",
			title: content.settingsLockedTitle,
			description: content.settingsLockedDescription,
		});
		return;
	}
	toast.add({
		type: "error",
		description: err.error?.message || err.message,
	});
}

export function ErrorToaster() {
	const queryClient = useQueryClient();

	useEffect(() => {
		const queryCache = queryClient.getQueryCache();
		const previousQueryOnError = queryCache.config.onError;

		queryCache.config.onError = (error, query) => {
			previousQueryOnError?.(error, query);

			if (!matchQuery({ queryKey: authQueryKeys.all }, query)) return;
			if (getAuthErrorPresentation(query.meta) !== "toast") return;

			const err = error as BetterFetchError;
			if (err?.error?.code === "EMAIL_NOT_VERIFIED") return;
			if (err?.error) addAuthErrorToast(err);
		};

		const mutationCache = queryClient.getMutationCache();
		const previousMutationOnError = mutationCache.config.onError;

		mutationCache.config.onError = (
			error,
			variables,
			onMutateResult,
			mutation,
			context,
		) => {
			previousMutationOnError?.(
				error,
				variables,
				onMutateResult,
				mutation,
				context,
			);

			if (!matchMutation({ mutationKey: authMutationKeys.all }, mutation)) {
				return;
			}
			if (getAuthErrorPresentation(mutation.meta) !== "toast") return;
			// Every form that sets a new password renders this one against the
			// password field, so a toast would just repeat it.
			if (isPasswordCompromisedError(error)) return;

			const err = error as BetterFetchError;
			if (
				err.error?.code === "EMAIL_NOT_VERIFIED" &&
				!matchMutation({ mutationKey: oneTapMutationKeys.prompt }, mutation)
			) {
				return;
			}
			addAuthErrorToast(err);
		};

		return () => {
			queryCache.config.onError = previousQueryOnError;
			mutationCache.config.onError = previousMutationOnError;
		};
	}, [queryClient]);

	return null;
}
