import { FooterSection } from "../models/FooterSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getFooter, update: updateFooter } = createSingletonController(FooterSection);
export const footerJumps = createArrayItemController(FooterSection, "jumps");
