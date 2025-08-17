import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { join } from "node:path";

async function migrations(request, response) {
  const allowedMethods = ["GET", "POST"];
  if (request.method && !allowedMethods.includes(request.method)) {
    return response
      .status(405)
      .json({
        error: `Method "${request.method}" not allowed`,
      })
      .end();
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

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

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const migratedMigrations = await migrationRunner({
        ...defaultMigrationRunnerOptions,
        dryRun: false,
      });

      if (migratedMigrations.length > 0) {
        return response.status(201).json(migratedMigrations);
      }

      return response.status(200).json(migratedMigrations);
    }
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }
}

export default migrations;
