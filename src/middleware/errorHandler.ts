import type { Request, Response, NextFunction } from "express";
import logger from "@/logger";
import CustomError from "@/utils/CustomError";

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  logger.error(err);

  const statusCode =
    err instanceof CustomError && err.statusCode ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
  });
}

export default errorHandler;
