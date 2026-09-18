import { randomUUID } from "node:crypto";
import { eq } from "drizzle-orm";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { db } from "#/db";
import { getUser } from "#/db/queries/users";
import { user } from "#/db/schema";

const testUserId = `test-${randomUUID()}`;

beforeAll(async () => {
	await db.insert(user).values({
		id: testUserId,
		name: "Vitest Test User",
		email: `${testUserId}@example.test`,
	});
});

afterAll(async () => {
	await db.delete(user).where(eq(user.id, testUserId));
});

describe("getUser", () => {
	it("returns the user matching the id", async () => {
		const result = await getUser(testUserId);

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			id: testUserId,
			name: "Vitest Test User",
		});
	});

	it("returns an empty array for an unknown id", async () => {
		const result = await getUser(`unknown-${randomUUID()}`);

		expect(result).toEqual([]);
	});
});
