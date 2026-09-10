import { Router } from "express";
import { getSection, updateSection, experience } from "../controllers/experienceController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/section", getSection);
router.put("/section", protect, updateSection);

router.get("/", experience.list);
router.get("/:id", experience.getOne);
router.post("/", protect, experience.create);
router.put("/:id", protect, experience.update);
router.delete("/:id", protect, experience.remove);

export default router;
