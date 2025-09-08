import type { Request } from "express";

export enum ROLES {
  "staff" = 1,
  "borrower",
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}
export interface JwtPayload {
  id: number;
  email: string;
  role: ROLES;
}
