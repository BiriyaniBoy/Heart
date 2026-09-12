import { Router } from "express";
import {
  getSettings,
  updateSettings,
  updateBackground,
  updateOverlayOpacity,
  deleteBackground,
  updateAdminAvatar,
  deleteAdminAvatar,
} from "../controllers/settingsController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

// Public: the admin login screen needs its background (and avatar mark) before anyone is authenticated.
router.get("/", getSettings);
router.put("/", protect, updateSettings);
router.put("/background", protect, uploadImage, updateBackground);
router.put("/background/opacity", protect, updateOverlayOpacity);
router.delete("/background", protect, deleteBackground);
router.put("/admin-avatar", protect, uploadImage, updateAdminAvatar);
router.delete("/admin-avatar", protect, deleteAdminAvatar);

export default router;
