import type { Request, Response, NextFunction } from "express";
import * as staffService from "@/services/staffService";




/**
 * Handles the registration of new staff members.
 * 
 * @param req - Express request object containing staff registration data in the body
 * @param res - Express response object used to send back the created staff data
 * @param next - Express next function for error handling
 * @throws Will pass any service errors to Express error handler
 * @returns Promise that resolves when staff is registered
 */
export async function registerStaff(req: Request, res: Response, next: NextFunction) {
  try {
    const staff = await staffService.register(req.body);
    res.status(201).json({ data: staff })
  }
  catch (error) {
    next(error)
  }
}

/**
 * Authenticates staff member and returns a JWT token
 * @param {Request} req - Express request object containing login credentials in the body
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next middleware function
 * @returns {Promise<void>} - Returns a JWT token in the response if authentication is successful
 * @throws {Error} - Throws an error if authentication fails
 */
export async function loginStaff(req: Request, res: Response, next: NextFunction){
  try {
    const token = await staffService.login(req.body);
    // TODO use secure cookies 
    res.status(200).json({token})
  } catch(error){
    next(error)
  }
}