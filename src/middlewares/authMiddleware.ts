import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Token tidak ditemukan" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded; // simpan payload user ke req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token tidak valid" });
    return;
  }
};
