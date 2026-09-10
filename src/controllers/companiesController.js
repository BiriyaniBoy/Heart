import { Company } from "../models/Company.js";
import { CompaniesSection } from "../models/CompaniesSection.js";
import { createCrudController } from "../utils/crudFactory.js";
import { createSingletonController } from "../utils/singletonFactory.js";

export const { get: getSection, update: updateSection } = createSingletonController(CompaniesSection);
export const companies = createCrudController(Company);
