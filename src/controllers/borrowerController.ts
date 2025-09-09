import type { Request, Response, NextFunction } from "express";
import * as borrowerService from "@/services/borrowerService";
import CustomError from "@/utils/CustomError";

/**
 * Registers a new borrower.
 *
 * @returns A promise resolving to the created borrower in JSON
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
 * Authenticates a borrower and issues a JWT token.
 *
 * @returns A promise resolving to a JWT token in JSON
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
 * Retrieves a list of all borrowers.
 *
 * @returns A promise resolving to a list of borrowers in JSON
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
 * Retrieves a single borrower by ID.
 *
 * @returns A promise resolving to a borrower in JSON
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
 * Updates a borrower by ID.
 *
 * @returns A promise resolving to the updated borrower in JSON
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
 * Deletes a borrower by ID.
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
