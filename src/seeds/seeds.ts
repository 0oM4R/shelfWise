import bcrypt from "bcrypt";
import { sequelize } from "@/database/db"; // adjust path
import Book from "@/models/Book";
import Borrower from "@/models/Borrower";
import Staff from "@/models/Staff";
import BorrowedBook from "@/models/BorrowedBook";
import logger from "@/logger";

export default async function seed() {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");

    const salt = await bcrypt.genSalt(10);

    // Seed Staff
    await Staff.bulkCreate(
      [
        {
          name: "Admin User",
          email: "admin@example.com",
          password: await bcrypt.hash("admin123", salt),
        },
        {
          name: "Librarian One",
          email: "librarian1@example.com",
          password: await bcrypt.hash("lib123", salt),
        },
      ],
      { ignoreDuplicates: true }, // Ignore if email already exists
    );

    // Seed Borrowers
    await Borrower.bulkCreate(
      [
        {
          name: "John Doe",
          email: "john@example.com",
          password: await bcrypt.hash("password1", salt),
        },
        {
          name: "Jane Smith",
          email: "jane@example.com",
          password: await bcrypt.hash("password2", salt),
        },
      ],
      { ignoreDuplicates: true }, // Ignore if email already exists
    );

    // Seed Books
    await Book.bulkCreate(
      [
        {
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          isbn: "9780743273565",
          availableCopies: 5,
          shelfLabel: "A1",
        },
        {
          title: "1984",
          author: "George Orwell",
          isbn: "9780451524935",
          availableCopies: 3,
          shelfLabel: "B2",
        },
        {
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          isbn: "9780060935467",
          availableCopies: 4,
          shelfLabel: "C3",
        },
      ],
      { ignoreDuplicates: true }, // Ignore if isbn already exists
    );

    // Seed Borrowed Books
    // Use `findOrCreate` since there's no unique constraint combining bookId & borrowerId
    await Promise.all([
      BorrowedBook.findOrCreate({
        where: { bookId: 1, borrowerId: 1 },
        defaults: {
          borrowDate: new Date(),
          dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        },
      }),
      BorrowedBook.findOrCreate({
        where: { bookId: 2, borrowerId: 2 },
        defaults: {
          borrowDate: new Date(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        },
      }),
    ]);
  } catch (error) {
    logger.error("Seeding error:");
    logger.error(error);
  }
}
