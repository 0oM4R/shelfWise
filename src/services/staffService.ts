
import { Staff } from '@/models'
import { ROLES } from '@/types';
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { type CreationAttributes } from 'sequelize';

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
      email: input.email
    }
  })
  if (exists) throw new Error("User exists");

  const staff = await Staff.create(input);
  return ({ id: staff.id, name: staff.name, email: staff.email } as StaffResponse);

}
/**
 * Login a staff member by email and password, and return a JWT token.
 *
 * @param input - The email and password of the staff member.
 * @returns A JWT token which can be used to authenticate the staff member.
 *
 * @throws {Error} InvalidCredentials - If the email or password is incorrect.
 */
export async function login(input: { email: string, password: string }): Promise<string> {
  const staff = await Staff.findOne({ where: { email: input.email } });
  if (!staff) throw new Error("InvalidCredentials")
  const match = await bcrypt.compare(input.password, staff.password)
  if (!match) throw new Error("InvalidCredentials");
  const token = jwt.sign({
    id: staff.id,
    email: staff.email,
    role: ROLES.staff,
  },
    //todo add to config
    "secret",
    {
      expiresIn: "1D"
    })
  return token;
}