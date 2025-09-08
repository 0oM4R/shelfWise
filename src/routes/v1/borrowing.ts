import { Router } from "express";
import {
  createBorrowing,
  listAllBorrowing,
  returnBook,
  getAllOverdue,
  getBorrowingById,
} from "@/controllers/borrowController";
import { authnMiddleware, authzMiddleware } from "@/middleware";
import { ROLES } from "@/types";
import authMiddleware from "@/middleware/authentication";

const router = Router();

router.post(
  "/",
  authnMiddleware,
  authzMiddleware(ROLES.borrower, ROLES.staff),
  createBorrowing,
);
router.get("/", authMiddleware, authzMiddleware(ROLES.staff), listAllBorrowing);
router.post("/return", authnMiddleware, returnBook);
router.get(
  "/overdue",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  getAllOverdue,
);
router.get(
  "/:id",
  authnMiddleware,
  authzMiddleware(ROLES.staff),
  getBorrowingById,
);
export default router;
