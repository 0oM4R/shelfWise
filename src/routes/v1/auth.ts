import { Router } from "express";
import { registerStaff, loginStaff } from "@/controllers/staffControllers";
import {
  loginBorrower,
  registerBorrower,
} from "@/controllers/borrowerController";

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
 * POST /borrower/register → Register a new borrower
 * POST /borrower/login    → Authenticate a borrower and issue a JWT
 *
 * Access:
 * - Both endpoints are public (no authentication required)
 */

router.post("/staff/register", registerStaff);

router.post("/staff/login", loginStaff);

router.post("/borrower/register", registerBorrower);
router.post("/borrower/login", loginBorrower);

export default router;
