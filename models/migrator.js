import { resolve } from "node:path";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";

async function runMigrations(dryRun = false) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dir: resolve("infra", "migrations"),
      direction: "up",
      verbose: true,
      migrationsTable: "pgmigrations",
      dbClient,
      dryRun,
    });

    return migrations;
  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient?.end();
  }
}

async function getPendingMigrations() {
  return runMigrations(true);
}

async function runPendingMigrations() {
  return runMigrations();
}

const migrator = {
  getPendingMigrations,
  runPendingMigrations,
};

export default migrator;
