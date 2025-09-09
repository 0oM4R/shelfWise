import { BorrowedBook, Borrower, Book, sequelize } from "@/models";
import CustomError from "@/utils/CustomError";
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
/**
 * Checkout a book to a borrower.
 * @throws Error if book or borrower not found.
 */
export async function checkout(input: BorrowingInput): Promise<BorrowedBook> {
  return await sequelize.transaction(async (t) => {
    const book = await Book.findOne({
      where: { id: input.bookID },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!book)
      throw new CustomError(
        "Book not found for checkout. Please verify the book ID.",
        404,
      );

    const borrower = await Borrower.findOne({
      where: { id: input.borrowerID },
      transaction: t,
    });
    if (!borrower)
      throw new CustomError(
        "Borrower not found for checkout. Please verify the borrower ID.",
        404,
      );

    const borrowRecord = await BorrowedBook.create(input, { transaction: t });

    book.availableCopies -= 1;
    await book.save({ transaction: t });

    return borrowRecord;
  });
}

/**
 * Get all borrowing records.
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
 * Get a borrowing record by ID.
 * @throws Error if not found.
 */
export async function getByID(id: number): Promise<BorrowedBook> {
  const book = await BorrowedBook.findByPk(id, {
    include: defaultInclude,
  });
  if (!book)
    throw new CustomError(
      "Borrowing record not found for the provided ID.",
      404,
    );
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
  if (!book)
    throw new CustomError(
      "No borrowing records found for the provided borrower ID.",
      404,
    );
  return book;
}

export async function getByBookID(id: number): Promise<BorrowedBook[]> {
  const book = await BorrowedBook.findAll({
    where: {
      bookId: id,
    },
    include: [
      {
        model: Borrower,
        as: "borrower",
        attributes: ["id", "name", "email"],
      },
    ],
    order: [["returnedDate", "DESC"]],
  });
  if (!book)
    throw new CustomError(
      "No borrowing records found for the provided borrower ID.",
      404,
    );
  return book;
}

/**
 * Update a borrowing record by ID.
 * @throws Error if not found.
 */
export async function update(
  id: number,
  updates: Partial<Omit<BorrowedBook, "id">>,
): Promise<BorrowedBook> {
  const borrowRecord = await BorrowedBook.findByPk(id);
  if (!borrowRecord)
    throw new CustomError(
      "Borrowing record not found for update. Please verify the record ID.",
      404,
    );

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
  if (!borrowRecord)
    throw new CustomError(
      "No borrowing record found for the given book and borrower IDs. Cannot mark as returned.",
      404,
    );
  await borrowRecord.update({
    returnedDate: new Date(),
  });
  return borrowRecord.get();
}
