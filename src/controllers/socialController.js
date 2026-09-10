import { SocialLinks } from "../models/SocialLinks.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { createArrayItemController } from "../utils/arrayItemFactory.js";

export const { get: getSocial, update: updateSocial } = createSingletonController(SocialLinks);
export const primaryLinks = createArrayItemController(SocialLinks, "primary");
export const footerLinks = createArrayItemController(SocialLinks, "footer");
