import { Router } from "express";
import { getSection, updateSection, companies } from "../controllers/companiesController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/section", getSection);
router.put("/section", protect, updateSection);

router.get("/", companies.list);
router.get("/:id", companies.getOne);
router.post("/", protect, companies.create);
router.put("/:id", protect, companies.update);
router.delete("/:id", protect, companies.remove);

export default router;
