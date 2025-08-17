import database from "infra/database.js";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("PATCH to /api/v1/migrations should return 200", async () => {
  const firstResponse = await fetch("http://localhost:3000/api/v1/migrations", {
    method: "PATCH",
  });
  expect(firstResponse.status).toBe(405);

  const response = await fetch(
    "http://localhost:3000/api/v1/migrations/api/v1/status"
  );
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database.opened_connections).toBeDefined();
  expect(responseBody.dependencies.database.opened_connections).toEqual(1);
});
