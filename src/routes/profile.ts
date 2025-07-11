import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getMe,
  getUserByUsername,
  updateProfile,
} from "../controllers/user/user";
import { uploadImage, uploadToCloudinary } from "../middlewares/multer";
import { initCloudinary } from "../middlewares/cloudinery";

const profileRouter = express.Router();

profileRouter.get("/users", getAllUsers);
profileRouter.get("/me", authenticate, getMe);
profileRouter.get("/profile/:username", authenticate, getUserByUsername);
profileRouter.put(
  "/me",
  authenticate,
  initCloudinary,
  uploadImage.single("photo"),
  uploadToCloudinary,
  updateProfile
);

export default profileRouter;
