import dbClient from "#infra/database.js";

import express from "express";

const router = express.Router();

router.get("/status", async (request, response) => {
  const updatedAt = new Date().toISOString();
  const queryVersion = await dbClient.query("SHOW server_version;");
  const postgresVersion = queryVersion[0].server_version;

  const maxConnectionsQuery = await dbClient.query("SHOW max_connections;");
  const postgresMaxConnections = maxConnectionsQuery[0].max_connections;
  const database = process.env.POSTGRES_DB;

  const currentConnectionsQuery = await dbClient.query(
    "SELECT COUNT(*)::int AS total_conexoes_ativas FROM pg_stat_activity WHERE datname = :database;",
    {
      replacements: { database },
    }
  );

  const activeConnections = currentConnectionsQuery[0][0].total_conexoes_ativas;

  return response.status(200).json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: postgresVersion,
        max_connections: postgresMaxConnections,
        active_connections: activeConnections,
      },
    },
  });
});

export default router;
