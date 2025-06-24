import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

// Buat komentar
export const createComment = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: user.id,
      },
    });

    res
      .status(201)
      .json({ message: "Komentar berhasil ditambahkan", data: comment });
  } catch (error) {
    res.status(500).json({ message: "Gagal menambahkan komentar", error });
  }
};

// Ambil semua komentar untuk 1 post
export const getCommentsByPost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, username: true, photo: true },
        },
      },
    });

    res
      .status(200)
      .json({ message: "Komentar berhasil diambil", data: comments });
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil komentar", error });
  }
};

// Hapus komentar (hanya oleh author)
export const deleteComment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = (req as any).user;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });

    if (!comment || comment.authorId !== user.id) {
      res
        .status(403)
        .json({ message: "Tidak diizinkan menghapus komentar ini" });
      return;
    }

    await prisma.comment.delete({ where: { id } });

    res.status(200).json({ message: "Komentar berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: "Gagal menghapus komentar", error });
  }
};
