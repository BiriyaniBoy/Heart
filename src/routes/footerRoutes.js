import { Router } from "express";
import { getFooter, updateFooter, footerJumps } from "../controllers/footerController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getFooter);
router.put("/", protect, updateFooter);
router.post("/jumps", protect, footerJumps.add);
router.put("/jumps/:itemId", protect, footerJumps.update);
router.delete("/jumps/:itemId", protect, footerJumps.remove);

export default router;
