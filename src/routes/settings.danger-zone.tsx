import { ensureSession } from "@better-auth-ui/core";
import { ensureSessionServer } from "@better-auth-ui/core/server";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequestHeaders } from "@tanstack/react-start/server";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "#/components/shadcn/ui/alert-dialog";
import { Button } from "#/components/shadcn/ui/button";
import { toast } from "#/components/shadcn/ui/toast";
import { getDangerZoneContent } from "#/content";
import { auth } from "#/lib/auth/auth";
import { authClient } from "#/lib/auth/auth-client";
import { clearTransactions } from "#/server/functions/transactions";

export const Route = createFileRoute("/settings/danger-zone")({
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
	component: DangerZonePage,
});

function DangerZonePage() {
	const dangerZoneContent = getDangerZoneContent();
	const queryClient = useQueryClient();
	const { mutate, isPending } = useMutation({
		mutationFn: () => clearTransactions(),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["transactions"] });
			toast.add({
				type: "success",
				title: dangerZoneContent.successToastTitle,
			});
		},
	});

	return (
		<div className="w-full max-w-3xl mx-auto p-4 md:p-6 flex flex-col gap-4">
			<h1 className="text-xl font-semibold">{dangerZoneContent.heading}</h1>

			<div className="flex items-center justify-between gap-4 rounded-none border border-destructive/30 p-4">
				<div className="flex flex-col gap-1">
					<span className="font-medium">
						{dangerZoneContent.clearTransactionsTitle}
					</span>
					<span className="text-sm text-muted-foreground">
						{dangerZoneContent.clearTransactionsDescription}
					</span>
				</div>

				<AlertDialog>
					<AlertDialogTrigger
						render={<Button variant="destructive" disabled={isPending} />}
					>
						{dangerZoneContent.clearTransactionsButton}
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								{dangerZoneContent.confirmTitle}
							</AlertDialogTitle>
							<AlertDialogDescription>
								{dangerZoneContent.confirmDescription}
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel disabled={isPending}>
								{dangerZoneContent.cancelButton}
							</AlertDialogCancel>
							<AlertDialogAction
								variant="destructive"
								disabled={isPending}
								onClick={() => mutate()}
							>
								{dangerZoneContent.confirmButton}
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	);
}
