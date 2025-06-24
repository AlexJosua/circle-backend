import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../utils/multer";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
} from "../controllers/posts/posts";

const postsRouter = express.Router();

postsRouter.post("/post", authenticate, upload.single("photo"), createPost);
postsRouter.get("/post", getAllPosts);
postsRouter.get("/post/:id", getPostById);
postsRouter.delete("/post/:id", authenticate, deletePost);

export default postsRouter;
