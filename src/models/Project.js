import mongoose from "mongoose";

const { Schema } = mongoose;

const statSchema = new Schema({ label: String, value: String }, { _id: false });

const linksSchema = new Schema(
  {
    github: { type: String, default: "" },
    live: { type: String, default: "" },
    appStore: { type: String, default: "" },
    playStore: { type: String, default: "" },
  },
  { _id: false }
);

const projectSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, "slug may only contain lowercase letters, numbers and hyphens"],
    },
    name: { type: String, required: true, trim: true },
    categories: { type: [String], default: [] },
    rating: { type: String, default: "" },
    badges: { type: [String], default: [] },
    description: { type: String, default: "" },
    stats: { type: [statSchema], default: [] },
    features: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    linkLabel: { type: String, default: "" },
    meta: { type: String, default: "" },
    links: { type: linksSchema, default: () => ({}) },
    // Optional Cloudinary screenshot — falls back to the CSS device mock
    // on the frontend when absent.
    image: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Project = mongoose.model("Project", projectSchema);
