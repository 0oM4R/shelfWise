import { Book } from "@/models";
import CustomError from "@/utils/CustomError";
import { type CreationAttributes } from "sequelize";

interface BookInput extends CreationAttributes<Book> {
  title: string;
  author: string;
  isbn: string;
  availableCopies: number;
  shelfLabel: string;
}

/**
 * Add a new book.
 * @throws Error if ISBN exists.
 */
export async function add(input: BookInput): Promise<Book> {
  const exists = await Book.findOne({
    where: {
      isbn: input.isbn,
    },
  });
  if (exists)
    throw new CustomError(
      "A book with this ISBN already exists. Please use a unique ISBN.",
      409,
    );

  const book = await Book.create(input);
  return book;
}

/**
 * Get all books.
 */
export async function listAll(): Promise<Book[]> {
  const books = await Book.findAll();
  return books;
}

/**
 * Get a book by ID.
 * @throws Error if not found.
 */
export async function getByID(id: number): Promise<Book> {
  const book = await Book.findByPk(id);
  if (!book)
    throw new CustomError(
      "No book found with the provided ID. Please check the book ID and try again.",
      404,
    );
  return book.dataValues;
}

/**
 * Update a book by ID.
 * @throws Error if not found.
 */
export async function update(
  id: number,
  updates: Partial<Omit<Book, "id">>,
): Promise<Book> {
  const book = await Book.findByPk(id);
  if (!book)
    throw new CustomError(
      "No book found to update with the provided ID. Please check the book ID and try again.",
      404,
    );

  await book.update(updates);
  const updated = (await book.get()) as Book;
  return updated;
}

/**
 * Delete a book by ID.
 * @throws Error if not found.
 */
export async function deleteByID(id: number): Promise<void> {
  const deleted = await Book.destroy({
    where: { id },
  });
  if (deleted === 0)
    throw new CustomError(
      "No book found to delete with the provided ID. Please check the book ID and try again.",
      404,
    );
  return;
}

import { Op } from "sequelize";

/**
 * Search books by title, author, or ISBN.
 */
export async function search(query: string): Promise<Book[]> {
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `${query}%` } },
        { author: { [Op.like]: `${query}%` } },
        { isbn: { [Op.like]: `${query}%` } },
      ],
    },
  });

  return books;
}
