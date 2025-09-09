import type { Request, Response, NextFunction } from "express";
import * as borrowerService from "@/services/borrowerService";
import CustomError from "@/utils/CustomError";

/**
 * Register a new borrower.
 */
export async function registerBorrower(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const borrower = await borrowerService.register(req.body);
    res.status(201).json({ data: borrower });
  } catch (error) {
    next(error);
  }
}

/**
 * Login a borrower and return JWT.
 */
export async function loginBorrower(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = await borrowerService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

/**
 * Get all borrowers.
 */
export async function listAllBorrower(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const borrower = await borrowerService.listAll();
    res.status(200).json({ data: borrower });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a borrower by ID.
 */
export async function getBorrowerByID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid borrower ID in request. Please provide a valid borrower ID.",
        400,
      );
    const borrower = await borrowerService.getByID(id);
    res.status(200).json({ data: borrower });
  } catch (error) {
    next(error);
  }
}

/**
 * Update a borrower by ID.
 */
export async function updateBorrowerById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid borrower ID for update. Please provide a valid borrower ID.",
        400,
      );
    const borrower = await borrowerService.update(id, req.body);
    res.status(200).json({ data: borrower });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete a borrower by ID.
 */
export async function deleteBorrowerById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid borrower ID for deletion. Please provide a valid borrower ID.",
        400,
      );
    await borrowerService.deleteByID(id);
    res
      .status(200)
      .json({ message: `Borrower with id "${id}" deleted successfully` });
  } catch (error) {
    next(error);
  }
}
