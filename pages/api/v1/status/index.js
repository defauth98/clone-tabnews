import { createRouter } from "next-connect";

import database from "infra/database.js";
import {
  onErrorHandler,
  onNoMatchHandler,
} from "infra/utils/custom-controller-handlers";

const router = createRouter();

router.get(getHandler);

export default router.handler({
  onNoMatch: onNoMatchHandler,
  onError: onErrorHandler,
});

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionValue = databaseVersionResult.rows[0].server_version;

  const databaseMaximumConnectionsResult = await database.query(
    "SHOW max_connections;",
  );
  const databaseMaximumConnectionsValue =
    databaseMaximumConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1;",
    values: [databaseName],
  });
  const databaseOpenedConnectionsValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: databaseVersionValue,
        maximum_connections: parseInt(databaseMaximumConnectionsValue),
        opened_connections: databaseOpenedConnectionsValue,
      },
    },
  });
}
