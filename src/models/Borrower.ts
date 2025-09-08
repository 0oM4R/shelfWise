import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/database/db";
import bcrypt from "bcrypt";
/**
 * Represents a borrower in the library system.
 * @class
 * @extends Model
 *
 * @remarks
 * This model uses Sequelize ORM and includes validation for:
 * - Name length (2-100 characters)
 * - Email format and uniqueness
 * - Registration date validity
 */
export default class Borrower extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Borrower.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: {
          msg: "Must be a valid email address",
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [4, 100],
      },
    },
  },
  {
    sequelize,
    modelName: "Borrower",
    tableName: "borrowers",
    timestamps: true,
    hooks: {
      beforeCreate: async (borrower: Borrower) => {
        const salt = await bcrypt.genSalt(10);
        borrower.dataValues.password = await bcrypt.hash(
          borrower.dataValues.password,
          salt,
        );
      },
      beforeUpdate: async (borrower: Borrower) => {
        if (borrower.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          borrower.dataValues.password = await bcrypt.hash(
            borrower.dataValues.password,
            salt,
          );
        }
      },
    },
  },
);
