import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { uploadImage, uploadToCloudinary } from "../middlewares/multer";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
  getPostsByUserId,
} from "../controllers/posts/posts";
import { initCloudinary } from "../middlewares/cloudinery";

const postsRouter = express.Router();

postsRouter.post(
  "/post",
  authenticate,
  initCloudinary,
  uploadImage.single("photo"),
  uploadToCloudinary,
  createPost
);
postsRouter.get("/posts", getAllPosts);
postsRouter.get("/post/:id", getPostById);
postsRouter.get("/post/user/:id", getPostsByUserId);
postsRouter.put(
  "/post/:id",
  authenticate,
  initCloudinary,
  uploadImage.single("photo"),
  uploadToCloudinary,
  editPost
);
postsRouter.delete("/post/:id", authenticate, deletePost);

export default postsRouter;
