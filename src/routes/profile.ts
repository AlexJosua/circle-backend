import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getAllUsers,
  getMe,
  getUserByUsername,
  updateProfile,
} from "../controllers/user/user";
import { upload } from "../utils/multer";

const profileRouter = express.Router();

profileRouter.get("/users", getAllUsers);
profileRouter.get("/me", authenticate, getMe);
profileRouter.get("/profile/:username", authenticate, getUserByUsername);
profileRouter.put("/me", authenticate, upload.single("photo"), updateProfile);

export default profileRouter;
