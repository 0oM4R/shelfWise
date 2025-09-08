import { Staff } from "@/models";
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
 *
 * @throws {Error} "User exists" if a staff member with the same email already exists.
 *
 * @param input - The staff data to be registered.
 * @returns The registered staff member.
 */
export async function register(input: StaffInput): Promise<StaffResponse> {
  const exists = await Staff.findOne({
    where: {
      email: input.email,
    },
  });
  if (exists) throw new Error("User exists");

  const staff = (await Staff.create(input)).dataValues;
  return {
    id: staff.id,
    name: staff.name,
    email: staff.email,
  } as StaffResponse;
}
/**
 * Login a staff member by email and password, and return a JWT token.
 *
 * @param input - The email and password of the staff member.
 * @returns A JWT token which can be used to authenticate the staff member.
 *
 * @throws {Error} InvalidCredentials - If the email or password is incorrect.
 */
export async function login(input: {
  email: string;
  password: string;
}): Promise<string> {
  const staff = await Staff.findOne({ where: { email: input.email } });
  if (!staff) throw new Error("InvalidCredentials");
  const match = await bcrypt.compare(input.password, staff.dataValues.password);
  if (!match) throw new Error("InvalidCredentials");
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
 * Retrieves a list of all staff members from the database
 * @returns {Promise<Staff[]>} A promise that resolves to an array of Staff objects containing id, name, and email
 */
export async function listAll(): Promise<Staff[]> {
  const staff = await Staff.findAll({
    attributes: ["id", "name", "email"],
  });
  return staff;
}
/**
 * Retrieves a staff member by their ID from the database
 * @param id - The unique identifier of the staff member
 * @returns Promise that resolves to the Staff object with selected attributes
 * @throws Error if staff member is not found
 */
export async function getByID(id: number): Promise<Staff> {
  const staff = await Staff.findByPk(id, {
    attributes: ["id", "name", "email", "createdAt", "updatedAt"],
  });
  if (!staff) throw new Error("staff not found");
  return staff;
}

/**
 * Updates a staff member's information in the database
 * @param id - The unique identifier of the staff member to update
 * @param updates - Partial staff object containing the fields to update (excluding id)
 * @returns Object containing the updated staff member's id, name, email and updatedAt timestamp
 * @throws Error if staff member with given id is not found
 */
export async function update(id: number, updates: Partial<Omit<Staff, "id">>) {
  const staff = await Staff.findByPk(id);
  if (!staff) throw new Error("staff notfound");
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
 * Deletes a staff member from the database by their ID.
 * @param id - The unique identifier of the staff member to delete
 * @throws {Error} If no staff member is found with the given ID
 * @returns {Promise<void>} A promise that resolves when the staff member is successfully deleted
 */
export async function deleteByID(id: number) {
  const deleted = await Staff.destroy({
    where: { id },
  });
  if (deleted === 0) throw new Error("not found");
  return;
}
