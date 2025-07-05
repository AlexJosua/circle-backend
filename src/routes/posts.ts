import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { upload } from "../utils/multer";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
} from "../controllers/posts/posts";

const postsRouter = express.Router();

postsRouter.post("/post", authenticate, upload.single("photo"), createPost);
postsRouter.get("/posts", getAllPosts);
postsRouter.get("/post/:id", getPostById);
postsRouter.get("/post/user/:id", getPostsByUserId);
postsRouter.put("/post/:id", authenticate, upload.single("photo"), editPost);
postsRouter.delete("/post/:id", authenticate, deletePost);

export default postsRouter;
