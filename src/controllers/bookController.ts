import type { Request, Response, NextFunction } from "express";
import * as bookService from "@/services/booksService";
import * as borrowService from "@/services/borrowService";
import CustomError from "@/utils/CustomError";

/**
 * Add a new book.
 */
export async function AddBook(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const book = await bookService.add(req.body);
    res.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all books.
 */
export async function listAllBooks(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const books = await bookService.listAll();
    res.status(200).json({ data: books });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a book by ID.
 */
export async function getBookByID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid book ID in request. Please provide a valid book ID.",
        400,
      );
    const book = await bookService.getByID(id);
    res.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a book by ID.
 */
export async function updateBookById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid book ID for update. Please provide a valid book ID.",
        400,
      );
    const book = await bookService.update(id, req.body);
    res.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a book by ID.
 */
export async function deleteBookById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid book ID for deletion. Please provide a valid book ID.",
        400,
      );
    await bookService.deleteByID(id);
    res
      .status(200)
      .json({ message: `Book with id "${id}" deleted successfully` });
  } catch (error) {
    next(error);
  }
}

/**
 * Search books by title, author, or ISBN.
 */
export async function search(req: Request, res: Response, next: NextFunction) {
  try {
    const query = req.query.q as string;
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }
    const results = await bookService.search(query);
    return res.status(200).json(results);
  } catch (error) {
    next(error);
  }
}

/**
 * Get all borrowings for a book by book ID.
 */
export async function listAllBorrowingsByBookId(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bookId = Number(req.params.id);
    const borrowings = await borrowService.getByBookID(bookId);
    res.status(200).json({ data: borrowings });
  } catch (error) {
    next(error);
  }
}
