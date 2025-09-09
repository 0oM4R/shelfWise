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
 * Borrower routes.
 *
 * Endpoints:
 *   GET    /borrowings         - Get all borrowings for the authenticated borrower
 *   GET    /:id                - Get a borrower by ID (staff only)
 *   PUT    /:id                - Update a borrower by ID (staff only)
 *   GET    /                   - Get all borrowers (staff only)
 *   DELETE /:id                - Delete a borrower by ID (staff only)
 *
 * All routes except /borrowings require staff authorization.
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
