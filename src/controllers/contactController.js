import { ContactSection } from "../models/ContactSection.js";
import { createSingletonController } from "../utils/singletonFactory.js";

export const { get: getContact, update: updateContact } = createSingletonController(ContactSection);
