import { Router } from "express";
import authRoutes from "./authRoutes.js";
import profileRoutes from "./profileRoutes.js";
import statsRoutes from "./statsRoutes.js";
import companiesRoutes from "./companiesRoutes.js";
import techStackRoutes from "./techStackRoutes.js";
import experienceRoutes from "./experienceRoutes.js";
import projectsRoutes from "./projectsRoutes.js";
import skillsRoutes from "./skillsRoutes.js";
import processRoutes from "./processRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import contactRoutes from "./contactRoutes.js";
import socialRoutes from "./socialRoutes.js";
import footerRoutes from "./footerRoutes.js";
import settingsRoutes from "./settingsRoutes.js";
import { getPortfolio } from "../controllers/portfolioController.js";

const router = Router();

router.get("/portfolio", getPortfolio);

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/stats", statsRoutes);
router.use("/companies", companiesRoutes);
router.use("/techstack", techStackRoutes);
router.use("/experience", experienceRoutes);
router.use("/projects", projectsRoutes);
router.use("/skills", skillsRoutes);
router.use("/process", processRoutes);
router.use("/resume", resumeRoutes);
router.use("/contact", contactRoutes);
router.use("/social", socialRoutes);
router.use("/footer", footerRoutes);
router.use("/settings", settingsRoutes);

export default router;
