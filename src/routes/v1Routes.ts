import { Router } from "express";
import {
  staffRoutes,
  authRoutes,
  bookRoutes,
  borrowerRoutes,
  borrowingRoutes,
} from "./v1";

const v1Router = Router();
v1Router.use("/auth", authRoutes);
v1Router.use("/staff", staffRoutes);
v1Router.use("/books", bookRoutes);
v1Router.use("/borrowers", borrowerRoutes);
v1Router.use("/borrowings", borrowingRoutes);

export default v1Router;
