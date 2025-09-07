import { sequelize } from "@/database/db";
import Book from './Book'
import BorrowedBook from "./BorrowedBook";
import Borrower from "./Borrower";
import Staff from './Staff'

// relations

Book.hasMany(BorrowedBook,{foreignKey: "bookId", as: 'borrowRecords' })
Borrower.hasMany(BorrowedBook, {foreignKey: "borrowerId",  as: 'borrowedBooks'})

BorrowedBook.belongsTo(Book, {foreignKey: "bookId", as: "book"})
BorrowedBook.belongsTo(Borrower, {foreignKey:"borrowerId", as: "borrower"})

export { sequelize, Book, Borrower, BorrowedBook, Staff };