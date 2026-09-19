import { useAuth, useSession } from "@better-auth-ui/react";
import { isDemoAccountEmail } from "#/lib/demo-accounts";

export function useIsDemoAccount() {
	const { authClient } = useAuth();
	const { data: session } = useSession(authClient);
	const email = session?.user.email;
	return email ? isDemoAccountEmail(email) : false;
}
