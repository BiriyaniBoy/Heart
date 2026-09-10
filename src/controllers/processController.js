import { ProcessSection } from "../models/ProcessSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getProcess, update: updateProcess } = createSingletonController(ProcessSection);
export const processPhases = createArrayItemController(ProcessSection, "phases");
