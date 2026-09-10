import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { login, logout, me } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";

const router = Router();

// Slow down brute-force attempts against the single admin account.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many login attempts. Try again later." },
});

router.post(
  "/login",
  loginLimiter,
  [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty().withMessage("Password required")],
  validate,
  login
);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
