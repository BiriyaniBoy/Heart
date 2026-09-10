import { Router } from "express";
import { getSocial, updateSocial, primaryLinks, footerLinks } from "../controllers/socialController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getSocial);
router.put("/", protect, updateSocial);

router.post("/primary", protect, primaryLinks.add);
router.put("/primary/:itemId", protect, primaryLinks.update);
router.delete("/primary/:itemId", protect, primaryLinks.remove);

router.post("/footer", protect, footerLinks.add);
router.put("/footer/:itemId", protect, footerLinks.update);
router.delete("/footer/:itemId", protect, footerLinks.remove);

export default router;
