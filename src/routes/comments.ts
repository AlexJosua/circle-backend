import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  createComment,
  deleteComment,
  getCommentsByPost,
} from "../controllers/comments/comment";

const commentRouter = express.Router();

commentRouter.post("/posts/:postId/comments", authenticate, createComment);
commentRouter.get("/posts/:postId/comments", getCommentsByPost);
commentRouter.delete("/comments/:id", authenticate, deleteComment);

export default commentRouter;
