import { Router } from "express";
import { registerStaff, loginStaff } from "@/controllers/staffControllers";
import {
  loginBorrower,
  registerBorrower,
} from "@/controllers/borrowerController";

const router = Router();

/**
 * Auth routes.
 *
 * Endpoints:
 *   POST /staff/register     - Register a new staff member
 *   POST /staff/login        - Login a staff member and return JWT
 *   POST /borrower/register  - Register a new borrower
 *   POST /borrower/login     - Login a borrower and return JWT
 *
 * All endpoints are public (no authentication required).
 */

router.post("/staff/register", registerStaff);

router.post("/staff/login", loginStaff);

router.post("/borrower/register", registerBorrower);
router.post("/borrower/login", loginBorrower);

export default router;
