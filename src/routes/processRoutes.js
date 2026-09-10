import { Router } from "express";
import { getProcess, updateProcess, processPhases } from "../controllers/processController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getProcess);
router.put("/", protect, updateProcess);
router.post("/phases", protect, processPhases.add);
router.put("/phases/reorder", protect, processPhases.reorder);
router.put("/phases/:itemId", protect, processPhases.update);
router.delete("/phases/:itemId", protect, processPhases.remove);

export default router;
