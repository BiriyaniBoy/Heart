import { Router } from "express";
import { getResume, updateResume, updateResumeFile } from "../controllers/resumeController.js";
import { protect } from "../middleware/auth.js";
import { uploadDocument } from "../middleware/upload.js";

const router = Router();

router.get("/", getResume);
router.put("/", protect, updateResume);
router.put("/file", protect, uploadDocument, updateResumeFile);

export default router;
