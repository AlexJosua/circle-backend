import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get("/", (_, res) => {
  res.send("API is running ✅");
});

app.listen(PORT, () => {
  console.log(`running in localhost ${PORT}`);
});
