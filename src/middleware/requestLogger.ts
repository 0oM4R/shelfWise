import type { Request, Response, NextFunction } from "express";
import logger from "@/logger";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  logger.info(
    { method: req.method, url: req.originalUrl, body: req.body },
    "Incoming request",
  );
  next();
};

export default requestLogger;
