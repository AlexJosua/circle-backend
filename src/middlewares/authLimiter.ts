import rateLimit from "express-rate-limit";

export const authRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 5 menit
  max: 5,
  message: "terlalu banyak login , coba lagi nanti",
});
