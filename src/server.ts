import app from "@/app"
import config from "@/config/config"
import logger from "@/logger"

app.listen(config.port,()=>{
  logger.info(`Server running on port ${config.port}`);
})