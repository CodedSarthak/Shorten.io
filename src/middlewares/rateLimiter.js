import rateLimit from "express-rate-limit";

const myrateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: {
    message: "Too many login attempts. Please try again in 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export default myrateLimit;
