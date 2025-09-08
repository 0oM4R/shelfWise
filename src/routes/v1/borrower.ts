import { Router } from "express";
import {
  listAllBorrower,
  getBorrowerByID,
  updateBorrowerById,
  deleteBorrowerById,
} from "@/controllers/borrowerController";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";
import { getBorrowingsByBorrowerID } from "@/controllers/borrowController";

const router = Router();

/**
 * Borrower Management Routes
 *
 * Base path: /api/v1/borrower
 *
 * Endpoints:
 *
 * GET    /           → Retrieve all borrower members
 * GET    /:id        → Retrieve a borrower member by ID
 * PUT    /:id        → Update a borrower member by ID
 * DELETE /:id        → Delete a borrower member by ID
 *
 */

router.get("/borrowings", authnMiddleware, getBorrowingsByBorrowerID);
router.get(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  getBorrowerByID,
);

router.put(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  updateBorrowerById,
);

router.get("/", authnMiddleware, authzMiddleware(ROLES.staff), listAllBorrower);

router.delete(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  deleteBorrowerById,
);

export default router;
