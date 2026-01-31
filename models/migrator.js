import { resolve } from "node:path";
import database from "infra/database";
import migrationRunner from "node-pg-migrate";
import { ServiceError } from "infra/errors";

async function executeMigrations(dryRun = false) {
  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const migrations = await migrationRunner({
      dir: resolve("infra", "migrations"),
      direction: "up",
      migrationsTable: "pgmigrations",
      dbClient,
      log: () => {},
      dryRun,
    });

    return migrations;
  } finally {
    await dbClient?.end();
  }
}

async function getPendingMigrations() {
  try {
    return executeMigrations(true);
  } catch (error) {
    console.error(error);
    throw new ServiceError({
      message: "Erro ao tentar listar as migrations pendentes",
      cause: error,
    });
  }
}

async function runPendingMigrations() {
  try {
    return executeMigrations(false);
  } catch (error) {
    console.error(error);
    throw new ServiceError({
      message: "Erro ao tentar rodar as migrations pendentes",
      cause: error,
    });
  }
}

const migrator = {
  getPendingMigrations,
  runPendingMigrations,
};

export default migrator;
