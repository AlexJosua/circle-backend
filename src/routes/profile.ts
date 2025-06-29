import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import { getAllUsers, getMe, updateProfile } from "../controllers/user/user";
import { upload } from "../utils/multer";

const profileRouter = express.Router();

// profileRouter.get("/profile", authenticate, (req, res) => {
//   const user = (req as any).user;
//   res.json({ message: "Profil berhasil diakses", user });
// });

profileRouter.get("/users", getAllUsers);
profileRouter.get("/me", authenticate, getMe);
profileRouter.put("/me", authenticate, upload.single("photo"), updateProfile);

export default profileRouter;
