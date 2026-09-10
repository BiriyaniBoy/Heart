import { StatsSection } from "../models/StatsSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getStats, update: updateStats } = createSingletonController(StatsSection);
export const statItems = createArrayItemController(StatsSection, "items");
