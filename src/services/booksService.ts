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
 * Add a new book in the database.
 *
 * @param input - The book details to be added.
 * @returns A promise that resolves to the newly created book.
 * @throws Error if a book with the same ISBN already exists.
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
 * Retrieves all books from the database.
 *
 * @returns A promise that resolves to an array of books.
 */
export async function listAll(): Promise<Book[]> {
  const books = await Book.findAll();
  return books;
}

/**
 * Retrieves a book by its ID.
 *
 * @param id - The unique identifier of the book.
 * @returns A promise that resolves to the requested book.
 * @throws Error if no book is found with the given ID.
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
 * Updates a book's information.
 *
 * @param id - The unique identifier of the book to update.
 * @param updates - The fields to update (excluding `id`).
 * @returns A promise that resolves to the updated book.
 * @throws Error if no book is found with the given ID.
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
 * Deletes a book by its ID.
 *
 * @param id - The unique identifier of the book to delete.
 * @returns A promise that resolves when the book is successfully deleted.
 * @throws Error if no book is found with the given ID.
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
 * Searches for books by title, author, or ISBN.
 *
 * @param query - The search string to match against book title, author, or ISBN.
 * @returns A promise that resolves to an array of matching books.
 */
export async function search(query: string): Promise<Book[]> {
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        { title: { [Op.like]: `%${query}%` } },
        { author: { [Op.like]: `%${query}%` } },
        { isbn: { [Op.like]: `%${query}%` } },
      ],
    },
  });

  return books;
}
