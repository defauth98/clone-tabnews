import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(request, response) {
  const dbClient = await database.getNewClient();

  const defaultMigrationRunnerOptions = {
    dbClient,
    dir: join("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationRunnerOptions,
      dryRun: true,
    });
    await dbClient.end();

    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationRunnerOptions,
      dryRun: false,
    });
    await dbClient.end();

    if (migratedMigrations.length > 0) {
      response.status(201).json(migratedMigrations);
    }

    response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}

export default migrations;
