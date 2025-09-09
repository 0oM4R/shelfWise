import { DataTypes, Model } from "sequelize";
import { sequelize } from "@/database/db";

/**
 * Represents a book in the library system.
 * @class Book
 * @extends Model
 *
 *
 * Includes title, author, ISBN, available copies, and shelf location.
 * Timestamps `createdAt` and `updatedAt` are managed by Sequelize.
 */
export default class Book extends Model {
  public id!: number;
  public title!: string;
  public author!: string;
  public isbn!: string;
  public availableCopies!: number;
  public shelfLabel!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}
Book.init(
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 150],
        is: {
          args: /^[a-zA-Z0-9\s.,'!?:()-]+$/i,
          msg: "Title contains invalid characters for search",
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100],
        is: {
          args: /^[a-zA-Z\s.,'-]+$/i,
          msg: "Author name contains invalid characters",
        },
      },
    },
    isbn: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        is: {
          args: /^(?:\d{9}[\dXx]|\d{13}|\d{1,5}-\d{1,7}-\d{1,7}-[\dXx])$/,
          msg: "ISBN must be a valid ISBN-10 or ISBN-13 format",
        },
      },
    },
    availableCopies: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: 0,
        isInt: true,
      },
    },
    shelfLabel: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 20],
      },
    },
  },
  {
    sequelize,
    modelName: "Book",
    tableName: "books",
    indexes: [
      { fields: ["title"] },
      { fields: ["author"] },
      { fields: ["isbn"] },
    ],
    timestamps: true,
  },
);
