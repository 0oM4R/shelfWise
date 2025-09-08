import { Router } from "express";
import { registerStaff, loginStaff } from "@/controllers/staffControllers";

const router = Router();

/**
 * Authentication Routes for Staff
 *
 * Base path: /api/v1/auth
 *
 * Endpoints:
 *
 * POST /staff/register → Register a new staff member
 * POST /staff/login    → Authenticate a staff member and issue a JWT
 *
 * Access:
 * - Both endpoints are public (no authentication required)
 */

/**
 * Register a new staff member.
 *
 * @route POST /api/v1/auth/staff/register
 * @access Public
 */
router.post("/staff/register", registerStaff);

/**
 * Authenticate a staff member and return a JWT token.
 *
 * @route POST /api/v1/auth/staff/login
 * @access Public
 */
router.post("/staff/login", loginStaff);

export default router;
