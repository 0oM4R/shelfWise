import type { Request, Response, NextFunction } from "express";
import * as staffService from "@/services/staffService";
import CustomError from "@/utils/CustomError";

/**
 * Register a new staff member.
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
 * Login a staff member and return JWT.
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
 * Get all staff members.
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
 * Get a staff member by ID.
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
 * Update a staff member by ID.
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
 * Delete a staff member by ID.
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
