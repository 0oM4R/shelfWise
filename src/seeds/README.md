# Database Seeding

This directory contains the seed script for initializing the database with sample data for development and testing.

## Seeded Data

- **Staff**
  - Admin User: `admin@example.com` / password: `admin123`
  - Librarian One: `librarian1@example.com` / password: `lib123`
- **Borrowers**
  - John Doe: `john@example.com` / password: `password1`
  - Jane Smith: `jane@example.com` / password: `password2`
- **Books**
  - The Great Gatsby (F. Scott Fitzgerald, ISBN: 9780743273565, 5 copies, shelf A1)
  - 1984 (George Orwell, ISBN: 9780451524935, 3 copies, shelf B2)
  - To Kill a Mockingbird (Harper Lee, ISBN: 9780060935467, 4 copies, shelf C3)
- **Borrowed Books**
  - John Doe borrows The Great Gatsby (2 weeks)
  - Jane Smith borrows 1984 (1 week)

## How to Run the Seed Script

The seed script is located at `src/seeds/seeds.ts`. To run it, make sure your database is up and configured, then execute:

```bash
# Example using ts-node (if installed)
npx ts-node src/seeds/seeds.ts
```

Or, if you have a custom script in your `package.json`, use:

```bash
npm run seed
```

This will populate the database with the above users, books, and borrowed book records. Duplicate entries are ignored if they already exist.
