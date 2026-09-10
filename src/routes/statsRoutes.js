import { Router } from "express";
import { getStats, updateStats, statItems } from "../controllers/statsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getStats);
router.put("/", protect, updateStats);
router.post("/items", protect, statItems.add);
router.put("/items/reorder", protect, statItems.reorder);
router.put("/items/:itemId", protect, statItems.update);
router.delete("/items/:itemId", protect, statItems.remove);

export default router;
