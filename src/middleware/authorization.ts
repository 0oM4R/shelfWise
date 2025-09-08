import type { AuthenticatedRequest, ROLES } from "@/types";
import type { Request, Response, NextFunction } from "express";

/**
 * Middleware factory that creates a role-based authorization middleware.
 *
 * @param roles Array of roles that are allowed to access the protected route
 * @returns Express middleware function that checks if the authenticated user has the required role
 * @throws {Error} If user is not found or has insufficient permissions
 */
export default function authorizeRoles(...roles: ROLES[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as AuthenticatedRequest).user;
    if (!user) return res.status(403).json({ message: "User not found" });
    if (!roles.includes(user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }
    next();
  };
}
