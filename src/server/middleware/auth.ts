import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";

export const authMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const session = await auth.api.getSession({
		headers: getRequest().headers,
	});
	if (!session?.user) throw new Error("Unauthorized");
	return next({
		context: {
			ownerId: session.user.id,
		},
	});
});
