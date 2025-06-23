import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth";
import profileRouter from "./routes/profile";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/user", profileRouter);

app.get("/", (_, res) => {
  res.send("API is running ✅");
});

app.listen(PORT, () => {
  console.log(`running in localhost ${PORT}`);
});
