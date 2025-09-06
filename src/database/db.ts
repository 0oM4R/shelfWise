import { Sequelize } from "sequelize";
import config from "@/config/config"
import logger from "@/logger"
const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
    host: config.db.host,
    dialect: 'mysql'
});

async function connect(){
   try {
        await sequelize.authenticate();        
        logger.info('Connection to MySQL has been established successfully.');
    } catch (error) {
        logger.error('Unable to connect to the database');
        if(error){
          logger.error(`details: ${error}`)
        }
    }
} 

export {sequelize, connect}


