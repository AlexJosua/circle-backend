import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Ambil semua user (kecuali password)
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ message: "Berhasil ambil semua user", data: users });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil users", error });
  }
};
