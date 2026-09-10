import { Router } from "express";
import { getTechStack, updateTechStack, techCards } from "../controllers/techStackController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getTechStack);
router.put("/", protect, updateTechStack);
router.post("/cards", protect, techCards.add);
router.put("/cards/reorder", protect, techCards.reorder);
router.put("/cards/:itemId", protect, techCards.update);
router.delete("/cards/:itemId", protect, techCards.remove);

export default router;
