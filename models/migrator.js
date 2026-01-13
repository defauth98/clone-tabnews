import { resolve } from "node:path";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";

const defaultMigrationRunnerOptions = {
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

async function getPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const pendingMigrations = await migrationRunner({
      ...defaultMigrationRunnerOptions,
      dbClient,
      dryRun: true,
    });

    return pendingMigrations;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

async function runPendingMigrations() {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migratedMigrations = await migrationRunner({
      ...defaultMigrationRunnerOptions,
      dbClient,
      dryRun: false,
    });

    return migratedMigrations;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

const migrator = {
  getPendingMigrations,
  runPendingMigrations,
};

export default migrator;
