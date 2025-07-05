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
        likes: {
          select: {
            userId: true,
          },
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

export const getPostsByUserId = async (req: Request, res: Response) => {
  const { id: userId } = req.params;

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            photo: true,
          },
        },

        _count: {
          select: { likes: true, comments: true },
        },
      },
    });

    res.status(200).json({
      message: "List post milik user berhasil diambil",
      data: posts,
    });
  } catch (error) {
    res.status(500).json({
      message: "Gagal mengambil post user",
      error,
    });
  }
};

// DELETE
export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const post = await prisma.post.findUnique({ where: { id } });

    if (!post || post.authorId !== user.id) {
      res.status(403).json({ message: "Tidak diizinkan menghapus post ini" });
      return;
    }

    await prisma.comment.deleteMany({
      where: { postId: id },
    });

    await prisma.like.deleteMany({
      where: { postId: id },
    });

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post berhasil dihapus" });
  } catch (error) {
    console.error("Gagal hapus post", error);
    res.status(500).json({ message: "Gagal menghapus post", error });
  }
};

// Controller

export const editPost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { content } = req.body;
  const file = req.file;
  const user = (req as any).user;

  try {
    // 1. Cek apakah post milik user yang login
    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true },
    });

    if (!post) {
      res.status(404).json({ message: "Post tidak ditemukan" });
      return;
    }

    if (post.authorId !== user.id) {
      res
        .status(403)
        .json({ message: "Kamu tidak memiliki akses untuk mengedit post ini" });
      return;
    }

    // 2. Lanjut update jika pemiliknya benar
    const updated = await prisma.post.update({
      where: { id },
      data: {
        content,
        ...(file && { photo: `/uploads/${file.filename}` }),
      },
    });

    res.json({ message: "Post berhasil diupdate", data: updated });
  } catch (err) {
    console.error("Gagal update post", err);
    res.status(500).json({ message: "Gagal update post", error: err });
  }
};
