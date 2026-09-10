import { SkillsSection } from "../models/SkillsSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getSkills, update: updateSkills } = createSingletonController(SkillsSection);
export const skillColumns = createArrayItemController(SkillsSection, "columns");
