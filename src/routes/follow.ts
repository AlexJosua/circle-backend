import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  followUser,
  getFollowers,
  getFollowing,
  unfollowUser,
} from "../controllers/follows/follow";

const followRouter = express.Router();

followRouter.post("/users/:id/follow", authenticate, followUser);
followRouter.delete("/users/:id/unfollow", authenticate, unfollowUser);
followRouter.get("/users/:id/followers", getFollowers);
followRouter.get("/users/:id/following", getFollowing);

export default followRouter;
