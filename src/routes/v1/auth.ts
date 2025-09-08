import { Router } from "express";
import { registerStaff, loginStaff } from "@/controllers/staffControllers";

const router = Router();

/**
 * @route POST /api/v1/auth/staff/register
 * @description Register a new staff member
 * @access Public
 */
router.post("/staff/register", registerStaff);

/**
 * @route POST /api/v1/auth/staff/login
 * @description Authenticate staff and issue JWT
 * @access Public
 */
router.post("/staff/login", loginStaff);

export default router;
