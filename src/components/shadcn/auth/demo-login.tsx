import { useAuth, useSignInEmail } from "@better-auth-ui/react";
import { useState } from "react";
import { Button } from "#/components/shadcn/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "#/components/shadcn/ui/card";
import { toast } from "#/components/shadcn/ui/toast";
import { getDemoAccountsContent } from "#/content";
import { useSignInContinuation } from "#/lib/auth/use-sign-in-continuation";
import { DEMO_ACCOUNTS } from "#/lib/demo-accounts";
import { cn } from "#/lib/utils";

export type DemoLoginCardProps = {
	className?: string;
};

/**
 * Card offering one-click sign-in into any of the seeded demo accounts, so
 * visitors can explore the dashboard without creating an account.
 */
export function DemoLoginCard({ className }: DemoLoginCardProps) {
	const { authClient } = useAuth();
	const continueSignIn = useSignInContinuation();
	const content = getDemoAccountsContent();
	const [pendingId, setPendingId] = useState<string | null>(null);

	const { mutate: signInEmail } = useSignInEmail(authClient, {
		onError: () => {
			toast.add({ type: "error", title: content.signInErrorTitle });
		},
		onSuccess: (data) => continueSignIn(data),
		onSettled: () => setPendingId(null),
	});

	return (
		<Card className={cn("w-full max-w-sm", className)}>
			<CardHeader>
				<CardTitle className="text-xl font-semibold">
					{content.heading}
				</CardTitle>
				<CardDescription>{content.description}</CardDescription>
			</CardHeader>

			<CardContent className="grid grid-cols-2 gap-2 sm:grid-cols-3">
				{DEMO_ACCOUNTS.map((account, index) => (
					<Button
						key={account.id}
						type="button"
						variant="outline"
						disabled={pendingId !== null}
						aria-busy={pendingId === account.id}
						onClick={() => {
							setPendingId(account.id);
							signInEmail({ email: account.email, password: account.password });
						}}
					>
						{content.accountLabel(index + 1)}
					</Button>
				))}
			</CardContent>
		</Card>
	);
}
