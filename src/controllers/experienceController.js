import { Experience } from "../models/Experience.js";
import { ExperienceSection } from "../models/ExperienceSection.js";
import { createCrudController } from "../utils/crudFactory.js";
import { createSingletonController } from "../utils/singletonFactory.js";

export const { get: getSection, update: updateSection } = createSingletonController(ExperienceSection);
export const experience = createCrudController(Experience);
