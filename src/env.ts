import { config } from "dotenv";
import z from "zod";

config({ path: [".env.local", ".env"] });

const envSchema = z.object({
	DATABASE_URL: z.url(),
	BETTER_AUTH_SECRET: z.string().min(1),
	BETTER_AUTH_URL: z.url(),
});

export const env = envSchema.parse(process.env);
