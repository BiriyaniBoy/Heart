import { Router } from "express";
import { getSkills, updateSkills, skillColumns } from "../controllers/skillsController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getSkills);
router.put("/", protect, updateSkills);
router.post("/columns", protect, skillColumns.add);
router.put("/columns/reorder", protect, skillColumns.reorder);
router.put("/columns/:itemId", protect, skillColumns.update);
router.delete("/columns/:itemId", protect, skillColumns.remove);

export default router;
