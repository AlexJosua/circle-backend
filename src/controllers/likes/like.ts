import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

// Like post
export const likePost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id: postId } = req.params;

  try {
    await prisma.like.create({
      data: {
        userId: user.id,
        postId,
      },
    });

    res.status(201).json({ message: "Post berhasil di-like" });
  } catch (error: any) {
    if (error.code === "P2002") {
      res.status(400).json({ message: "Kamu sudah like post ini" });
      return;
    }
    res.status(500).json({ message: "Gagal like post", error });
  }
};

//unlike post
export const unlikePost = async (req: Request, res: Response) => {
  const user = (req as any).user;
  const { id: postId } = req.params;

  try {
    await prisma.like.delete({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    res.status(200).json({ message: "Berhasil unlike post" });
  } catch (error) {
    res.status(500).json({ message: "Gagal unlike post", error });
  }
};

// get like for a post
export const getLikesByPost = async (req: Request, res: Response) => {
  const { id: postId } = req.params;

  try {
    const likes = await prisma.like.findMany({
      where: { postId },
      include: {
        user: {
          select: { id: true, name: true, username: true, photo: true },
        },
      },
    });

    res
      .status(200)
      .json({ message: "List likes berhasil diambil", data: likes });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil likes", error });
  }
};
