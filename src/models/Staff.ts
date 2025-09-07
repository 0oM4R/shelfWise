import { DataTypes, Model } from 'sequelize';
import bcrypt from 'bcrypt'
import { sequelize } from '@/database/db';

/**
 * Represents a Staff member of the Library Management System.
 * Staff can manage books, borrowers, and borrowing records.
 */
export class Staff extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string; 

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Staff.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
        is: /^[a-zA-Z\s.'-]+$/i,
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100],
      },
    },
  },
  {
    sequelize,
    modelName: 'Staff',
    tableName: 'staff',
    timestamps: true,
    hooks: {
      beforeCreate: async (staff: Staff) => {
        staff.password = await bcrypt.hash(staff.password, 10);
      },
      beforeUpdate: async (staff: Staff) => {
        if (staff.changed("password")) {
          staff.password = await bcrypt.hash(staff.password, 10)
        }
      }
    }
  }
);
