import { BorrowedBook, Borrower, Book, sequelize } from "@/models";
import { type CreationAttributes, Op } from "sequelize";
const todayStr = new Date().toISOString().slice(0, 10);
const defaultInclude = [
  {
    model: Book,
    as: "book",
    attributes: ["id", "title"],
  },
  {
    model: Borrower,
    as: "borrower",
    attributes: ["id", "name", "email"],
  },
];
interface BorrowingInput extends CreationAttributes<BorrowedBook> {
  bookID: string;
  borrowerID: string;
  dueDate: Date;
}

/**
 * Add a new borrowed book in the database.
 *
 * @param input - The borrowing details to be added.
 * @returns A promise that resolves to the newly created book.
 * @throws Error if a book with the same ISBN already exists.
 */

export async function checkout(input: BorrowingInput): Promise<BorrowedBook> {
  return await sequelize.transaction(async (t) => {
    const book = await Book.findOne({
      where: { id: input.bookID },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!book) throw new Error("Book not found");

    const borrower = await Borrower.findOne({
      where: { id: input.borrowerID },
      transaction: t,
    });
    if (!borrower) throw new Error("Borrower not found");

    const borrowRecord = await BorrowedBook.create(input, { transaction: t });

    book.availableCopies -= 1;
    await book.save({ transaction: t });

    return borrowRecord;
  });
}

/**
 * Retrieves all borrowing records from the database.
 *
 * @returns A promise that resolves to an array of books.
 */
export async function listAll(): Promise<BorrowedBook[]> {
  const books = await BorrowedBook.findAll({
    include: defaultInclude,
    order: [["returnedDate", "DESC"]],
  });
  return books;
}

export async function listAllReturned(): Promise<BorrowedBook[]> {
  const books = await BorrowedBook.findAll({
    where: {
      returnedDate: { not: null },
    },
    include: defaultInclude,
    order: [["returnedDate", "DESC"]],
  });
  return books;
}

export async function listAllOverDue(): Promise<BorrowedBook[]> {
  const books = await BorrowedBook.findAll({
    where: {
      returnedDate: { [Op.is]: null },
      dueDate: { [Op.lt]: todayStr },
    },
    include: defaultInclude,
    order: [["returnedDate", "DESC"]],
  });
  return books;
}

/**
 * Retrieves a borrowing record by its ID.
 *
 * @param id - The unique identifier of the record.
 * @returns A promise that resolves to the requested book.
 * @throws Error if no book is found with the given ID.
 */
export async function getByID(id: number): Promise<BorrowedBook> {
  const book = await BorrowedBook.findByPk(id, {
    include: defaultInclude,
  });
  if (!book) throw new Error("Borrowing record not found");
  return book.dataValues;
}

export async function getByBorrowerID(id: number): Promise<BorrowedBook[]> {
  const book = await BorrowedBook.findAll({
    where: {
      borrowerId: id,
    },
    include: [
      {
        model: Book,
        as: "book",
        attributes: ["id", "title"],
      },
    ],
    order: [["returnedDate", "DESC"]],
  });
  if (!book) throw new Error("Borrowing record not found");
  return book;
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
  updates: Partial<Omit<BorrowedBook, "id">>,
): Promise<BorrowedBook> {
  const borrowRecord = await BorrowedBook.findByPk(id);
  if (!borrowRecord) throw new Error("Book not found");

  await borrowRecord.update(updates);
  const updated = await getByID(borrowRecord.id);
  return updated;
}

export async function returnBook(bookId: number, borrowerId: number) {
  const borrowRecord = await BorrowedBook.findOne({
    where: {
      bookId,
      borrowerId,
    },
  });
  if (!borrowRecord) throw new Error("not found");
  await borrowRecord.update({
    returnedDate: new Date(),
  });
  return borrowRecord.get();
}
