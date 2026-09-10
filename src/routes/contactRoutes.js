import { Router } from "express";
import { getContact, updateContact } from "../controllers/contactController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", getContact);
router.put("/", protect, updateContact);

export default router;
