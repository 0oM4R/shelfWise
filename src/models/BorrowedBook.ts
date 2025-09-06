import { DataTypes, Model } from 'sequelize';
import { sequelize } from '@/database/db';
import Book  from './Book';
import Borrower  from './Borrower';

/**
 * Represents a borrowing record linking a Borrower to a Book.
 * Tracks borrow date, due date, and return date.
 */
export  default class BorrowedBook extends Model {
  public id!: number;
  public bookId!: number;
  public borrowerId!: number;
  public borrowDate!: Date;
  public dueDate!: Date;
  public returnedDate!: Date | null;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

BorrowedBook.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    bookId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Book,
        key: 'id',
      },
    },
    borrowerId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: Borrower,
        key: 'id',
      },
    },
    borrowDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: { isDate: true },
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: { isDate: true },
    },
    returnedDate: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: { isDate: true },
    },
  },
  {
    sequelize,
    modelName: 'BorrowedBook',
    tableName: 'borrowed_books',
    timestamps: true,
  }
);
