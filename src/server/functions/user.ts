import { createServerFn } from "@tanstack/react-start";
import { getUser } from "#/db/queries/users";
import { authMiddleware } from "#/server/middleware/auth";

export const whoAmI = createServerFn({ method: "GET" })
	.middleware([authMiddleware])
	.handler(({ context }) => getUser(context.userId));
