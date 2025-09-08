import type { Request, Response, NextFunction } from "express";
import * as bookService from "@/services/booksService";

/**
 * Add a new book.
 *
 * @returns A promise resolving to the created book in JSON
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
 * Retrieves a list of all books.
 *
 * @returns A promise resolving to a list of books in JSON
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
 * Retrieves a single book by ID.
 *
 * @returns A promise resolving to a book in JSON
 */
export async function getBookByID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id) throw new Error("Invalid id");
    const book = await bookService.getByID(id);
    res.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a book by ID.
 *
 * @returns A promise resolving to the updated book in JSON
 */
export async function updateBookById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id) throw new Error("Invalid id");
    const book = await bookService.update(id, req.body);
    res.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a book by ID.
 */
export async function deleteBookById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id) throw new Error("Invalid id");
    await bookService.deleteByID(id);
    res
      .status(200)
      .json({ message: `Book with id "${id}" deleted successfully` });
  } catch (error) {
    next(error);
  }
}

/**
 * Search for books by title, author, or ISBN.
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
