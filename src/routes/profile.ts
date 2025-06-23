import express from "express";
import { authenticate } from "../middlewares/authMiddleware";

const profileRouter = express.Router();

profileRouter.get("/profile", authenticate, (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Profil berhasil diakses", user });
});

export default profileRouter;
