
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/database/db';
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
          msg: 'Must be a valid email address',
        },
      },
    },
    password:{
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: true,
        len: [4,16]
      }
    },
  },
  {
    sequelize,
    modelName: 'Borrower',
    tableName: 'borrowers',
    timestamps: true,
  }
);
