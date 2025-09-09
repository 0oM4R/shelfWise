import type { Request, Response, NextFunction } from "express";
import * as staffService from "@/services/staffService";
import CustomError from "@/utils/CustomError";

/**
 * Registers a new staff member.
 *
 * @returns A promise resolving to the created staff member in JSON
 */
export async function registerStaff(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const staff = await staffService.register(req.body);
    res.status(201).json({ data: staff });
  } catch (error) {
    next(error);
  }
}

/**
 * Authenticates a staff member and issues a JWT token.
 *
 * @returns A promise resolving to a JWT token in JSON
 */
export async function loginStaff(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const token = await staffService.login(req.body);
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a list of all staff members.
 *
 * @returns A promise resolving to a list of staff members in JSON
 */
export async function listAllStaff(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const staff = await staffService.listAll();
    res.status(200).json({ data: staff });
  } catch (error) {
    next(error);
  }
}

/**
 * Retrieves a single staff member by ID.
 *
 * @returns A promise resolving to a staff member in JSON
 */
export async function getStaffByID(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid staff ID in request. Please provide a valid staff ID.",
        400,
      );
    const staff = await staffService.getByID(id);
    res.status(200).json({ data: staff });
  } catch (error) {
    next(error);
  }
}

/**
 * Updates a staff member by ID.
 *
 * @returns A promise resolving to the updated staff in JSON
 */
export async function updateStaffById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid staff ID for update. Please provide a valid staff ID.",
        400,
      );
    const staff = await staffService.update(id, req.body);
    res.status(200).json({ data: staff });
  } catch (error) {
    next(error);
  }
}

/**
 * Deletes a staff member by ID.
 */
export async function deleteStaffById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const id = +(req.params?.id || 0);
    if (!id)
      throw new CustomError(
        "Invalid  staff ID for deletion. Please provide a valid staff ID.",
        400,
      );
    await staffService.deleteByID(id);
    res
      .status(200)
      .json({ message: `Staff with id "${id}" deleted successfully` });
  } catch (error) {
    next(error);
  }
}
