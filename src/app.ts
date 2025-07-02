import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";
import postsRouter from "./routes/posts";
import commentRouter from "./routes/comments";
import followRouter from "./routes/follow";
import likeRouter from "./routes/like";
import cors from "cors";
import path from "path";
import searchRouter from "./routes/search";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);
app.use("/api", postsRouter);
app.use("/api", commentRouter);
app.use("/api", followRouter);
app.use("/api", likeRouter);
app.use("/api", searchRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// app.get("/", (_, res) => {
//   res.send("API is running ✅");
// });

app.listen(PORT, () => {
  console.log(`server is running in port ${PORT}`);
});
