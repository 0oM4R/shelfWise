import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload, AuthenticatedRequest } from "@/types";

/**
 * Middleware function for authentication using JWT tokens.
 * Verifies the presence and validity of a JWT token in the request headers.
 *
 * @throws {Error} If no authorization header is present
 * @throws {Error} If the token is invalid or expired
 */
export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1] || "";
  try {
    const decoded = jwt.verify(token, "secret") as JwtPayload;
    (req as AuthenticatedRequest).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
