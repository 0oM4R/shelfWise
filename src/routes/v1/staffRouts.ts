import { Router } from "express";
import {
  listAllStaff,
  getStaffByID,
  updateStaffById,
  deleteStaffById,
} from "@/controllers/staffControllers";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";

const router = Router();

// TODO: Some access should be restricted to admin only once the admin role is added.

/**
 * Staff routes.
 *
 * Endpoints:
 *   GET    /        - Get all staff members (staff only)
 *   GET    /:id     - Get a staff member by ID (staff only)
 *   PUT    /:id     - Update a staff member by ID (staff only)
 *   DELETE /:id     - Delete a staff member by ID (staff only)
 *
 * All endpoints require staff authorization.
 */

/**
 * Get a staff member by ID.
 */
router.get("/:id", authnMiddleware, authzMiddleware(ROLES.staff), getStaffByID);

/**
 * Update a staff member by ID.
 */
router.put(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  updateStaffById,
);

/**
 * Get all staff members.
 */
router.get("/", authnMiddleware, authzMiddleware(ROLES.staff), listAllStaff);

/**
 * Delete a staff member by ID.
 *
 * @route DELETE /api/v1/staff/:id
 * @access Protected (staff)
 */
router.delete(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  deleteStaffById,
);

export default router;
