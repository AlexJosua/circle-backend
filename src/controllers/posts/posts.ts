import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

// CREATE
export const createPost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { content } = req.body;
  const file = req.file;

  try {
    const post = await prisma.post.create({
      data: {
        content,
        photo: file ? `/uploads/${file.filename}` : null,
        authorId: user.id,
      },
    });

    res.status(201).json({ message: "Post berhasil dibuat", data: post });
  } catch (error) {
    res.status(500).json({ message: "Gagal membuat post", error });
  }
};

//GET ALL
export const getAllPosts = async (_: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, photo: true },
        },
        _count: {
          select: {
            comments: true,
            likes: true,
          },
        },
      },
    });

    res
      .status(200)
      .json({ message: "List post berhasil diambil", data: posts });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil post", error });
  }
};

// GET by ID
export const getPostById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, username: true, photo: true },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
        comments: {
          include: {
            author: {
              select: { id: true, name: true, username: true, photo: true },
            },
          },
        },
      },
    });

    if (!post) {
      res.status(404).json({ message: "Post tidak ditemukan" });
      return;
    }

    res
      .status(200)
      .json({ message: "Detail post berhasil diambil", data: post });
    return;
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil detail post", error });
    return;
  }
};

// DELETE
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    // Cek apakah post milik user ini
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== user.id) {
      res.status(403).json({ message: "Tidak diizinkan menghapus post ini" });
      return;
    }

    await prisma.post.delete({ where: { id } });

    res.status(200).json({ message: "Post berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus post", error });
  }
};
