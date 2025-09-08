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
// todo some access here should be enabled by admin only; once the admin role added

/**
 * @route GET /api/v1/staff/:id
 * @description Retrieve a staff member by ID
 * @access Protected (staff)
 */
router.get("/:id", authnMiddleware, authzMiddleware(ROLES.staff), getStaffByID);

/**
 * @route PUT /api/v1/staff/:id
 * @description Update a staff member by ID
 * @access Protected (staff)
 */
router.put(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  updateStaffById,
);

/**
 * @route GET /api/v1/staff
 * @description Retrieve all staff members
 * @access Protected (staff only)
 */
router.get("/", authnMiddleware, authzMiddleware(ROLES.staff), listAllStaff);

/**
 * @route DELETE /api/v1/staff/:id
 * @description Delete a staff member by ID
 * @access Protected (staff)
 */
router.delete(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  deleteStaffById,
);

export default router;
