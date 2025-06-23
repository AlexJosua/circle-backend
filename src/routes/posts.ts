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

postsRouter.post("/", authenticate, upload.single("photo"), createPost);
postsRouter.get("/", getAllPosts);
postsRouter.get("/:id", getPostById);
postsRouter.delete("/:id", authenticate, deletePost);

export default postsRouter;
