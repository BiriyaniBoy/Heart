import { ApiError } from "./ApiError.js";

/**
 * Standard REST CRUD for a top-level collection (e.g. Company, Experience,
 * Project — independent entities the admin adds/removes one at a time).
 * Every resource that needs this shape reuses it instead of re-implementing
 * the same five handlers.
 */
export function createCrudController(Model, { sortField = "order" } = {}) {
  return {
    list: async (req, res) => {
      const docs = await Model.find().sort({ [sortField]: 1, createdAt: 1 });
      res.json({ success: true, data: docs });
    },

    getOne: async (req, res) => {
      const doc = await Model.findById(req.params.id);
      if (!doc) throw new ApiError(404, "Not found");
      res.json({ success: true, data: doc });
    },

    create: async (req, res) => {
      const doc = await Model.create(req.body);
      res.status(201).json({ success: true, data: doc });
    },

    update: async (req, res) => {
      const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        returnDocument: "after",
        runValidators: true,
      });
      if (!doc) throw new ApiError(404, "Not found");
      res.json({ success: true, data: doc });
    },

    remove: async (req, res) => {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) throw new ApiError(404, "Not found");
      res.json({ success: true, data: doc });
    },
  };
}
