import type { Response, NextFunction } from "express";
import * as borrowService from "@/services/borrowService";
import CustomError from "@/utils/CustomError";
import type { AuthenticatedRequest } from "@/types";

/**
 * Create a borrowing record.
 */
export async function createBorrowing(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const book = await borrowService.checkout({
      ...req.body,
      borrowerID: req.user?.id,
    });
    res.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all borrowings for the authenticated borrower.
 */
export async function getBorrowingsByBorrowerID(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = +(req.user?.id || 0);
    if (!id)
      throw new CustomError(
        "Unauthorized: Invalid borrower ID in authentication token.",
        401,
      );
    const book = await borrowService.getByBorrowerID(id);
    res.status(201).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all borrowing records.
 */
export async function listAllBorrowing(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const book = await borrowService.listAll();
    res.status(200).json({ data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Mark a book as returned by the borrower.
 */
export async function returnBook(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const book = await borrowService.returnBook(req.body.bookId, req.user.id);
    res.status(200).json({ message: "book marked as returned", data: book });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all overdue borrowings.
 */
export async function getAllOverdue(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const books = await borrowService.listAllOverDue();
    res.status(200).json({ data: books });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a borrowing record by ID.
 */
export async function getBorrowingById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = +(req.params.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid borrowing record ID in request. Please provide a valid ID.",
        400,
      );
    const books = await borrowService.getByID(id);
    res.status(200).json({ data: books });
  } catch (error) {
    next(error);
  }
}
