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
 * Staff Management Routes
 *
 * Base path: /api/v1/staff
 *
 * Endpoints:
 *
 * GET    /           → Retrieve all staff members (protected, staff only)
 * GET    /:id        → Retrieve a staff member by ID (protected, staff only)
 * PUT    /:id        → Update a staff member by ID (protected, staff only)
 * DELETE /:id        → Delete a staff member by ID (protected, staff only)
 *
 * Access:
 * - Currently restricted to staff role via `authzMiddleware(ROLES.staff)`.
 * - In the future, some endpoints may be admin-only.
 */

/**
 * Retrieve a staff member by ID.
 *
 * @route GET /api/v1/staff/:id
 * @access Protected (staff)
 */
router.get("/:id", authnMiddleware, authzMiddleware(ROLES.staff), getStaffByID);

/**
 * Update a staff member by ID.
 *
 * @route PUT /api/v1/staff/:id
 * @access Protected (staff)
 */
router.put(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  updateStaffById,
);

/**
 * Retrieve all staff members.
 *
 * @route GET /api/v1/staff
 * @access Protected (staff only)
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
