import { Router } from "express";
import {
  listAllBooks,
  getBookByID,
  search,
  AddBook,
  updateBookById,
  deleteBookById,
} from "@/controllers/bookController";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";

const router = Router();

/**
 * Book Routes
 *
 * Base path: /api/v1/books
 *
 * Endpoints:
 *
 * GET /               → List all books
 * GET /search?q=term  → Search for books by title, author, or ISBN
 * GET /:id            → Retrieve a book by its ID
 * POST /              → Add a new book (staff only, requires authentication)
 * PUT /:id            → Update a book by its ID (staff only, requires authentication)
 * DELETE /:id         → Delete a book by its ID (staff only, requires authentication)
 *
 * Middlewares:
 * - `authnMiddleware` → Ensures the request is authenticated
 * - `authzMiddleware(ROLES.staff)` → Ensures only staff can create, update, or delete books
 */
router.get("/", listAllBooks);

router.get("/search", search);

router.get("/:id", getBookByID);

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
