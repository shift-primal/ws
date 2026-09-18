import handler from "@tanstack/react-start/server-entry";
import { paraglideMiddleware } from "#/paraglide/server.js";

const SECURITY_HEADERS = {
	"X-Frame-Options": "DENY",
	"X-Content-Type-Options": "nosniff",
	"Referrer-Policy": "strict-origin-when-cross-origin",
	"Permissions-Policy": "camera=(), microphone=(), geolocation=()",
	"Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
	"Content-Security-Policy":
		"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
} as const;

export default {
	async fetch(req: Request): Promise<Response> {
		const response = await paraglideMiddleware(req, () => handler.fetch(req));
		for (const [name, value] of Object.entries(SECURITY_HEADERS)) {
			response.headers.set(name, value);
		}
		return response;
	},
};
