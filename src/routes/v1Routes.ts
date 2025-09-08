import { Router } from "express";
import { staffRoutes, authRoutes, bookRoutes, borrowerRoutes } from "./v1";

const v1Router = Router();
v1Router.use("/auth", authRoutes);
v1Router.use("/staff", staffRoutes);
v1Router.use("/book", bookRoutes);
v1Router.use("/borrower", borrowerRoutes);

export default v1Router;
