import { Request, Response } from "express";
import { prisma } from "../../lib/prisma";

// Follow user
export const followUser = async (req: Request, res: Response) => {
  const follower = (req as any).user;
  const followingId = req.params.id;

  if (follower.id === followingId) {
    res.status(400).json({ message: "Gak bisa follow diri sendiri brooow" });
    return;
  }

  try {
    await prisma.follow.create({
      data: {
        followerId: follower.id,
        followingId,
      },
    });

    res.status(201).json({ message: "Berhasil follow user" });
  } catch (error: any) {
    if (error.code === "404") {
      res.status(400).json({ message: "Sudah follow user ini" });
      return;
    }
    res.status(500).json({ message: "Gagal follow user", error });
  }
};

// Unfollow user
export const unfollowUser = async (req: Request, res: Response) => {
  const follower = (req as any).user;
  const followingId = req.params.id;

  try {
    // Cek dulu apakah follow exist
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId,
        },
      },
    });

    if (!follow) {
      res.status(404).json({ message: "Kamu belum follow user ini" });
      return;
    }

    await prisma.follow.delete({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId,
        },
      },
    });

    res.status(200).json({ message: "Berhasil unfollow user" });
  } catch (error) {
    res.status(500).json({ message: "Gagal unfollow user", error });
  }
};

// Get followers of a user
export const getFollowers = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const followers = await prisma.follow.findMany({
      where: { followingId: id },
      include: {
        follower: {
          select: { id: true, name: true, username: true, photo: true },
        },
      },
    });

    res.status(200).json({ message: "List followers", data: followers });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil followers", error });
  }
};

// Get following of a user
export const getFollowing = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const following = await prisma.follow.findMany({
      where: { followerId: id },
      include: {
        following: {
          select: { id: true, name: true, username: true, photo: true },
        },
      },
    });

    res.status(200).json({ message: "List following", data: following });
  } catch (error) {
    res.status(500).json({ message: "Gagal ambil following", error });
  }
};

export const getSuggestedUsers = async (req: Request, res: Response) => {
  const currentUserId = (req as any).user.id;

  try {
    const followed = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    const followedIds = followed.map((f) => f.followingId);

    const users = await prisma.user.findMany({
      where: {
        id: {
          notIn: [...followedIds, currentUserId],
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        photo: true,
      },
    });

    res.json({ data: users });
  } catch (error) {
    console.error("Error getting suggested users", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
