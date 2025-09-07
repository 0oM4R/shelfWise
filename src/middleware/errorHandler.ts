import type { Request, Response, NextFunction } from "express";
import logger from "@/logger";

function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  logger.error(err);

  const message = err.message || "Internal Server Error";

  res.status(500).json({
    success: false,
    message,
  });
}

export default errorHandler;
