import { Borrower } from "@/models";
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
 * Registers a new borrower.
 *
 * @param input - The borrower data to be registered.
 * @returns A borrower object containing id, name, and email.
 *
 * @throws {Error} If a borrower with the same email already exists.
 */
export async function register(
  input: BorrowerInput,
): Promise<BorrowerResponse> {
  const exists = await Borrower.findOne({ where: { email: input.email } });
  if (exists) throw new Error("User exists");

  const borrower = (await Borrower.create(input)).dataValues;
  return {
    id: borrower.id,
    name: borrower.name,
    email: borrower.email,
  };
}

/**
 * Logs in a borrower by verifying their email and password.
 *
 * @param input - An object containing the borrower's email and password.
 * @returns A signed JWT token that can be used for authentication.
 *
 * @throws {Error} If the email does not exist or the password is incorrect.
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<string> {
  const borrower = await Borrower.findOne({ where: { email: input.email } });
  if (!borrower) throw new Error("InvalidCredentials");

  const match = await bcrypt.compare(
    input.password,
    borrower.dataValues.password,
  );
  if (!match) throw new Error("InvalidCredentials");
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
 * Retrieves all borrowers.
 *
 * @returns A promise that resolves to an array of borrower objects
 * (id, name, and email only).
 */
export async function listAll(): Promise<Borrower[]> {
  return Borrower.findAll({
    attributes: ["id", "name", "email"],
  });
}

/**
 * Retrieves a borrower by their ID.
 *
 * @param id - The unique identifier of the borrower.
 * @returns A borrower object containing id, name, email, createdAt, and updatedAt.
 *
 * @throws {Error} If no borrower is found with the given ID.
 */
export async function getByID(id: number): Promise<Borrower> {
  const borrower = await Borrower.findByPk(id, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });
  if (!borrower) throw new Error("borrower not found");
  return borrower;
}

/**
 * Updates a borrower's information.
 *
 * @param id - The unique identifier of the borrower to update.
 * @param updates - Partial borrower object containing the fields to update.
 * @returns An object containing the updated borrower's id, name, email, and updatedAt.
 *
 * @throws {Error} If no borrower is found with the given ID.
 */
export async function update(
  id: number,
  updates: Partial<Omit<Borrower, "id">>,
) {
  const borrower = await Borrower.findByPk(id);
  if (!borrower) throw new Error("borrower not found");

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
 * Deletes a borrower by their ID.
 *
 * @param id - The unique identifier of the borrower to delete.
 * @returns A promise that resolves when the borrower is successfully deleted.
 *
 * @throws {Error} If no borrower is found with the given ID.
 */
export async function deleteByID(id: number) {
  const deleted = await Borrower.destroy({ where: { id } });
  if (deleted === 0) throw new Error("not found");
  return;
}
