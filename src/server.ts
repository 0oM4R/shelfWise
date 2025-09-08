import app from "@/app";
import config from "@/config/config";
import logger from "@/logger";
import { connect, sync } from "@/database/db";
import seed from "./seeds/seeds";

/**
 * Starts the Express server, attempting to connect to the database,
 * and sync the database schema if not already done.
 *
 * If the database connection fails, the process exits with code 1.
 */
async function startServer() {
  try {
    logger.info("Testing DB connection...");
    await connect();

    logger.info("Syncing DB...");
    await sync();

    logger.info("Database synced successfully");
    await seed();
    logger.info("seed generated successfully");
    app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server:`);
    if (error instanceof Error) {
      logger.error(error.message);
    }
    process.exit(1);
  }
}

startServer();
