import { Sequelize } from "sequelize";
import config from "@/config/config";
import logger from "@/logger";

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect: "postgres",
  },
);

/**
 * Syncs the database schema with the current Sequelize models.
 * If the database connection was successful, but the sync failed, this function will throw an error.
 * If the sync was successful, it will log a success message.
 *
 * @throws {Error} If the sync fails.
 */
async function sync() {
  try {
    await sequelize.sync({ alter: true });
    logger.info("Database synced successfully");
  } catch (error) {
    logger.error("Failed to sync database");
    throw error;
  }
}

/**
 * Tests the connection to the database, throwing an error if the connection
 * cannot be established.
 *
 * @throws {Error} If the connection to the database cannot be established.
 */
async function connect() {
  try {
    await sequelize.authenticate();
    logger.info("Connection to database has been established successfully.");
  } catch (error) {
    logger.error(`Unable to connect to the database on port ${config.db.port}`);
    throw error;
  }
}
export { sequelize, connect, sync };
