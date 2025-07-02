import express from "express";
import { searchUsers } from "../controllers/search/search";

const searchRouter = express.Router();

searchRouter.get("/search", searchUsers);

export default searchRouter;
