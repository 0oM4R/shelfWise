import { Router } from "express";
import {bookRoutes} from "./v1"

const v1Router = Router();

v1Router.use("/books", bookRoutes);

export default v1Router;
