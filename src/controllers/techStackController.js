import { TechStackSection } from "../models/TechStackSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getTechStack, update: updateTechStack } = createSingletonController(TechStackSection);
export const techCards = createArrayItemController(TechStackSection, "cards");
