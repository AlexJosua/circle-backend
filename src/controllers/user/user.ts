import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

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

export const getMe = async (req: Request, res: Response) => {
  const user = (req as any).user;

  try {
    const found = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        photo: true,
        _count: {
          select: {
            followers: true,
            following: true,
          },
        },
      },
    });

    if (!found) res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "Success", data: found });
    return;
  } catch (error) {
    res.status(500).json({ message: "Failed to get user", error });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { username, bio, name, photo } = req.body;

  try {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        username,
        bio,
        ...(photo && { photo }),
      },
    });

    res.json({ message: "Profile updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile", error: err });
  }
};

export const getUserByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        photo: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User tidak ditemukan" });
      return;
    }

    res.json({ data: user });
  } catch (error) {
    console.error("Gagal ambil data user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
