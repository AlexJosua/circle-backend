import express from "express";
import { login, register } from "../controllers/auth/auth";
import { authRateLimit } from "../middlewares/authLimiter";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", authRateLimit, login);

export default authRouter;
