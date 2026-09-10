import { Router } from "express";
import { getProfile, updateProfile, updateAvatar, updateAvatarPosition, deleteAvatar } from "../controllers/profileController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

router.get("/", getProfile);
router.put("/", protect, updateProfile);
router.put("/avatar", protect, uploadImage, updateAvatar);
router.put("/avatar/position", protect, updateAvatarPosition);
router.delete("/avatar", protect, deleteAvatar);

export default router;
