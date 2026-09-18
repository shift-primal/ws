import { useAuth, useSession, useSignInEmail } from "@better-auth-ui/react";
import { UsersThreeIcon } from "@phosphor-icons/react";
import { useState } from "react";
import {
	DropdownMenuItem,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "#/components/shadcn/ui/dropdown-menu";
import { toast } from "#/components/shadcn/ui/toast";
import { getDemoAccountsContent } from "#/content";
import { useSignInContinuation } from "#/lib/auth/use-sign-in-continuation";
import { DEMO_ACCOUNTS, isDemoAccountEmail } from "#/lib/demo-accounts";

/**
 * Submenu entry for the user dropdown, letting a visitor sign into (or
 * switch between) the demo accounts. Shown when signed out or signed into a
 * demo account; hidden for the real (non-demo) signed-in user.
 */
export function DemoAccountMenu() {
	const { authClient } = useAuth();
	const { data: session } = useSession(authClient);
	const continueSignIn = useSignInContinuation();
	const content = getDemoAccountsContent();
	const [pendingId, setPendingId] = useState<string | null>(null);

	const { mutate: signInEmail } = useSignInEmail(authClient, {
		onError: () => {
			toast.add({ type: "error", title: content.signInErrorTitle });
			setPendingId(null);
		},
		onSuccess: (data) => {
			// Switching between demo accounts mid-session needs a hard reload:
			// the dashboard's queries aren't scoped by user id, so a client-side
			// navigation alone would keep showing the previous account's data.
			// Signing in fresh from a signed-out state has no stale cache to
			// bust, so it can just navigate like the sign-in page does.
			if (session) window.location.reload();
			else continueSignIn(data);
		},
	});

	if (session && !isDemoAccountEmail(session.user.email)) return null;

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger>
				<UsersThreeIcon className="text-muted-foreground" />
				{content.switcherTrigger}
			</DropdownMenuSubTrigger>

			<DropdownMenuSubContent>
				{DEMO_ACCOUNTS.map((account, index) => (
					<DropdownMenuItem
						key={account.id}
						disabled={
							pendingId !== null || session?.user.email === account.email
						}
						onClick={() => {
							setPendingId(account.id);
							signInEmail({ email: account.email, password: account.password });
						}}
					>
						{content.accountLabel(index + 1)}
					</DropdownMenuItem>
				))}
			</DropdownMenuSubContent>
		</DropdownMenuSub>
	);
}
