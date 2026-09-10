import { ApiError } from "./ApiError.js";

/**
 * CRUD for one array-of-subdocuments field on a singleton section — e.g.
 * `StatsSection.items`, `TechStackSection.cards`, `ProcessSection.phases`.
 * These aren't independent top-level entities (crudFactory), they only
 * exist nested under their parent section, so they get Mongoose subdocument
 * `_id`s and are addressed as `/api/<section>/<arrayField>/:itemId`.
 */
export function createArrayItemController(Model, arrayField, defaults = {}) {
  async function getOrCreateDoc() {
    let doc = await Model.findOne();
    if (!doc) doc = await Model.create(defaults);
    return doc;
  }

  return {
    add: async (req, res) => {
      const doc = await getOrCreateDoc();
      doc[arrayField].push(req.body);
      await doc.save();
      res.status(201).json({ success: true, data: doc });
    },

    update: async (req, res) => {
      const doc = await getOrCreateDoc();
      const item = doc[arrayField].id(req.params.itemId);
      if (!item) throw new ApiError(404, "Item not found");
      item.set(req.body);
      await doc.save();
      res.json({ success: true, data: doc });
    },

    remove: async (req, res) => {
      const doc = await getOrCreateDoc();
      const item = doc[arrayField].id(req.params.itemId);
      if (!item) throw new ApiError(404, "Item not found");
      item.deleteOne();
      await doc.save();
      res.json({ success: true, data: doc });
    },

    reorder: async (req, res) => {
      const doc = await getOrCreateDoc();
      const order = Array.isArray(req.body.order) ? req.body.order : [];
      const byId = new Map(doc[arrayField].map((item) => [String(item._id), item]));
      if (order.length !== byId.size || order.some((id) => !byId.has(String(id)))) {
        throw new ApiError(400, "`order` must list every item id exactly once");
      }
      doc[arrayField] = order.map((id) => byId.get(String(id)));
      await doc.save();
      res.json({ success: true, data: doc });
    },
  };
}
