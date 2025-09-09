import { Staff } from "@/models";
import CustomError from "@/utils/CustomError";
import { ROLES } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type CreationAttributes } from "sequelize";

interface StaffInput extends CreationAttributes<Staff> {
  name: string;
  email: string;
  password: string;
}

interface StaffResponse {
  id: number;
  name: string;
  email: string;
}

/**
 * Register a new staff member.
 * @throws Error if email exists.
 */
export async function register(input: StaffInput): Promise<StaffResponse> {
  const exists = await Staff.findOne({
    where: {
      email: input.email,
    },
  });
  if (exists)
    throw new CustomError(
      "A staff member with this email already exists. Please use a different email address.",
      409,
    );

  const staff = (await Staff.create(input)).dataValues;
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
  } as StaffResponse;
}
/**
 * Login a staff member and return JWT.
 * @throws Error if credentials are invalid.
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<string> {
  const staff = await Staff.findOne({ where: { email: input.email } });
  if (!staff)
    throw new CustomError(
      "Invalid credentials for the provided staff account. Please try again.",
      401,
    );
  const match = await bcrypt.compare(input.password, staff.dataValues.password);
  if (!match)
    throw new CustomError(
      "Invalid credentials for the provided staff account. Please try again.",
      401,
    );
  const token = jwt.sign(
    {
      id: staff.dataValues.id,
      email: staff.dataValues.email,
      role: ROLES.staff,
    },
    //todo add to config
    "secret",
    {
      expiresIn: "1D",
    },
  );
  return token;
}

/**
 * Get all staff members.
 */
export async function listAll(): Promise<Staff[]> {
  const staff = await Staff.findAll({
    attributes: ["id", "name", "email"],
  });
  return staff;
}
/**
 * Get a staff member by ID.
 * @throws Error if not found.
 */
export async function getByID(id: number): Promise<Staff> {
  const staff = await Staff.findByPk(id, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });
  if (!staff)
    throw new CustomError("Staff member not found for the provided ID.", 404);
  return staff;
}

/**
 * Update a staff member by ID.
 * @throws Error if not found.
 */
export async function update(id: number, updates: Partial<Omit<Staff, "id">>) {
  const staff = await Staff.findByPk(id);
  if (!staff)
    throw new CustomError(
      "Staff member not found for update. Please check the staff ID and try again.",
      404,
    );
  await staff.update(updates);
  const updated = (await staff.get()) as Staff;
  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    updatedAt: updated.updatedAt,
  };
}

/**
 * Delete a staff member by ID.
 * @throws Error if not found.
 */
export async function deleteByID(id: number) {
  const deleted = await Staff.destroy({
    where: { id },
  });
  if (deleted === 0)
    throw new CustomError(
      "Staff member not found for deletion. Please check the staff ID and try again.",
      404,
    );
  return;
}
