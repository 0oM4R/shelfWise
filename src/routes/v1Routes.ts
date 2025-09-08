import { Router } from "express";
import { staffRoutes, authRoutes } from "./v1";

const v1Router = Router();
v1Router.use("/auth", authRoutes);
v1Router.use("/staff", staffRoutes);

export default v1Router;
