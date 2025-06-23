import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { generateToken } from "../../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, username, email, password, bio, photo } = req.body;

  try {
    const isExist = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (isExist) {
      res
        .status(400)
        .json({ message: "Email atau username sudah digunakan brooow" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        bio,
        photo,
      },
    });

    res.status(201).json({
      message: "Register berhasil",
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Email tidak ditemukan" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "Password salah" });
      return;
    }

    const token = generateToken({ id: user.id, username: user.username });

    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan", error });
    return;
  }
};
