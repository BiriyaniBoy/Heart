import { Router } from "express";
import { getSection, updateSection, projects, updateProjectImage } from "../controllers/projectsController.js";
import { protect } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

router.get("/section", getSection);
router.put("/section", protect, updateSection);

router.get("/", projects.list);
router.get("/:id", projects.getOne);
router.post("/", protect, projects.create);
router.put("/:id", protect, projects.update);
router.delete("/:id", protect, projects.remove);
router.put("/:id/image", protect, uploadImage, updateProjectImage);

export default router;
