/**
 * Borrowing routes.
 *
 * Endpoints:
 *   POST   /         - Create a borrowing record (borrower or staff)
 *   GET    /         - Get all borrowings (staff only)
 *   POST   /return   - Mark a book as returned (borrower or staff)
 *   GET    /overdue  - Get all overdue borrowings (staff only)
 *   GET    /:id      - Get a borrowing record by ID (staff only)
 *
 * Most endpoints require authentication and staff or borrower role as noted.
 */
import { Router } from "express";
import {
  createBorrowing,
  listAllBorrowing,
  returnBook,
  getAllOverdue,
  getBorrowingById,
} from "@/controllers/borrowController";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";
import authMiddleware from "@/middleware/authentication";

const router = Router();

router.post(
  "/",
  authnMiddleware,
  authzMiddleware(ROLES.borrower, ROLES.staff),
  createBorrowing,
);
router.get("/", authMiddleware, authzMiddleware(ROLES.staff), listAllBorrowing);
router.post("/return", authnMiddleware, returnBook);
router.get(
  "/overdue",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  getAllOverdue,
);
router.get(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  getBorrowingById,
);
export default router;
