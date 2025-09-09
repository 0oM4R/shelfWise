/**
 * Borrowing routes for managing book borrowing, returning, overdue tracking, and CSV exports.
 *
 * Endpoints:
 *   POST   /                - Create a borrowing record (borrower or staff)
 *   GET    /                - Get all borrowings (staff only)
 *   POST   /return          - Mark a book as returned (borrower or staff)
 *   GET    /overdue         - Get all overdue borrowings (staff only)
 *   GET    /:id             - Get a borrowing record by ID (staff only)
 *   GET    /export          - Export last month's borrowing records as CSV (staff only)
 *   GET    /export/overdue  - Export last month's overdue borrowings as CSV (staff only)
 *
 * Most endpoints require authentication. Staff-only endpoints require a valid staff JWT.
 */
import { Router } from "express";
import {
  createBorrowing,
  listAllBorrowing,
  returnBook,
  getAllOverdue,
  getBorrowingById,
  exportBorrowProcessesLastMonthToCSV,
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
router.post("/return", authnMiddleware, returnBook);
router.get(
  "/export/overdue",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  exportBorrowProcessesLastMonthToCSV,
);
router.get(
  "/export",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  exportBorrowProcessesLastMonthToCSV,
);
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
router.get("/", authMiddleware, authzMiddleware(ROLES.staff), listAllBorrowing);
export default router;
