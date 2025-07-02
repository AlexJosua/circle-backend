// src/controllers/users/search.ts
import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

export const searchUsers = async (req: Request, res: Response) => {
  const q = req.query.query as string;

  if (!q) {
    res.status(400).json({ message: "Query tidak boleh kosong." });
    return;
  }

  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { username: { contains: q, mode: "insensitive" } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        photo: true,
      },
      take: 20,
    });

    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ message: "Gagal melakukan pencarian", error });
  }
};
