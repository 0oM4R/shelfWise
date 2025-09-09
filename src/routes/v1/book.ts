import { Router } from "express";
import {
  listAllBooks,
  getBookByID,
  search,
  AddBook,
  updateBookById,
  deleteBookById,
  listAllBorrowingsByBookId,
} from "@/controllers/bookController";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";

const router = Router();

/**
 * Book routes.
 *
 * Endpoints:
 *   GET    /search           - Search books by title, author, or ISBN
 *   GET    /:id/borrowings   - Get all borrowings for a book
 *   GET    /:id              - Get a book by ID
 *   GET    /                 - Get all books
 *   POST   /                 - Add a new book (staff only)
 *   PUT    /:id              - Update a book by ID (staff only)
 *   DELETE /:id              - Delete a book by ID (staff only)
 *
 * POST, PUT, DELETE require staff authorization.
 */

router.get("/search", search);

router.get("/:id/borrowings", listAllBorrowingsByBookId);
router.get("/:id", getBookByID);

router.get("/", listAllBooks);

router.post("/", authnMiddleware, authzMiddleware(ROLES.staff), AddBook);

router.put(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  updateBookById,
);

router.delete(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  deleteBookById,
);

export default router;
