import type { Response, NextFunction } from "express";
import * as borrowService from "@/services/borrowService";
import type { AuthenticatedRequest } from "@/types";

/**
 * Add a new book.
 *
 * @returns A promise resolving to the created book in JSON
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

export async function getBorrowingsByBorrowerID(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
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

export async function getBorrowingById(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const id = +(req.params.id || 0);
    if (!id) throw new Error("bad request");
    const books = await borrowService.getByID(id);
    res.status(200).json({ data: books });
  } catch (error) {
    next(error);
  }
}
