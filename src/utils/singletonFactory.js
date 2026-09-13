import { sanitizeBody } from "./sanitizeBody.js";

/**
 * Fetches the one document for a singleton section, creating it with
 * schema defaults on first read if it doesn't exist yet. Exported on its
 * own (not just wrapped in createSingletonController) so the `/api/portfolio`
 * aggregate endpoint can apply the exact same "never null" guarantee —
 * every singleton section is guaranteed a real object, even on a freshly
 * seeded database that hasn't had `seed:content` run yet.
 */
export async function getOrCreateSingleton(Model, defaults = {}) {
  let doc = await Model.findOne();
  if (!doc) doc = await Model.create(defaults);
  return doc;
}

/**
 * For sections that are one config object, not a list — Profile, Resume,
 * ContactSection, FooterSection, CompaniesSection, ProjectsSection,
 * ExperienceSection, Settings. There's always exactly one document;
 * `get` creates it with defaults on first read, `update` upserts it.
 */
export function createSingletonController(Model, defaults = {}) {
  return {
    get: async (req, res) => {
      const doc = await getOrCreateSingleton(Model, defaults);
      res.json({ success: true, data: doc });
    },

    update: async (req, res) => {
      let doc = await Model.findOne();
      if (!doc) doc = new Model(defaults);
      doc.set(sanitizeBody(req.body));
      await doc.save();
      res.json({ success: true, data: doc });
    },
  };
}
