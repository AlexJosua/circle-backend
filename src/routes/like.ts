import express from "express";
import { authenticate } from "../middlewares/authMiddleware";
import {
  getLikesByPost,
  likePost,
  unlikePost,
} from "../controllers/likes/like";

const likeRouter = express.Router();

likeRouter.post("/posts/:id/like", authenticate, likePost);
likeRouter.delete("/posts/:id/unlike", authenticate, unlikePost);
likeRouter.get("/posts/:id/likes", getLikesByPost);

export default likeRouter;
