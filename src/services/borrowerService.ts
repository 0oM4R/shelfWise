import { Borrower } from "@/models";
import CustomError from "@/utils/CustomError";
import { ROLES } from "@/types";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type CreationAttributes } from "sequelize";

interface BorrowerInput extends CreationAttributes<Borrower> {
  name: string;
  email: string;
  password: string;
}

interface BorrowerResponse {
  id: number;
  name: string;
  email: string;
}

/**
 * Register a new borrower.
 * @throws Error if email exists.
 */
export async function register(
  input: BorrowerInput,
): Promise<BorrowerResponse> {
  const exists = await Borrower.findOne({ where: { email: input.email } });
  if (exists)
    throw new CustomError(
      "A borrower with this email already exists. Please use a different email address.",
      409,
    );

  const borrower = (await Borrower.create(input)).dataValues;
  return {
    id: borrower.id,
    name: borrower.name,
    email: borrower.email,
  };
}

/**
 * Login a borrower and return JWT.
 * @throws Error if credentials are invalid.
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<string> {
  const borrower = await Borrower.findOne({ where: { email: input.email } });
  if (!borrower)
    throw new CustomError(
      "Invalid credentials for the provided borrower account. Please try again.",
      401,
    );

  const match = await bcrypt.compare(
    input.password,
    borrower.dataValues.password,
  );
  if (!match)
    throw new CustomError(
      "Invalid credentials for the provided borrower account. Please try again.",
      401,
    );
  const token = jwt.sign(
    {
      id: borrower.dataValues.id,
      email: borrower.dataValues.email,
      role: ROLES.borrower,
    },
    // TODO: move secret to config/env variable
    "secret",
    { expiresIn: "1d" },
  );

  return token;
}

/**
 * Get all borrowers.
 */
export async function listAll(): Promise<Borrower[]> {
  return Borrower.findAll({
    attributes: ["id", "name", "email"],
  });
}

/**
 * Get a borrower by ID.
 * @throws Error if not found.
 */
export async function getByID(id: number): Promise<Borrower> {
  const borrower = await Borrower.findByPk(id, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });
  if (!borrower)
    throw new CustomError("Borrower not found for the provided ID.", 404);
  return borrower;
}

/**
 * Update a borrower by ID.
 * @throws Error if not found.
 */
export async function update(
  id: number,
  updates: Partial<Omit<Borrower, "id">>,
) {
  const borrower = await Borrower.findByPk(id);
  if (!borrower)
    throw new CustomError(
      "Borrower not found for update. Please check the borrower ID and try again.",
      404,
    );

  await borrower.update(updates);
  const updated = (await borrower.get()) as Borrower;

  return {
    id: updated.id,
    name: updated.name,
    email: updated.email,
    updatedAt: updated.updatedAt,
  };
}

/**
 * Delete a borrower by ID.
 * @throws Error if not found.
 */
export async function deleteByID(id: number) {
  const deleted = await Borrower.destroy({ where: { id } });
  if (deleted === 0)
    throw new CustomError(
      "No borrower found for deletion with the provided ID. Please check the borrower ID and try again.",
      404,
    );
  return;
}
