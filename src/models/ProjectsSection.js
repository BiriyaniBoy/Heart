import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({ id: String, label: String }, { _id: false });

/** Wrapper text + filter-tab definitions — the Project entities live in Project.js. */
const projectsSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "SELECTED WORKS" },
    title: { type: String, default: "Featured Production Projects" },
    categories: {
      type: [categorySchema],
      default: [{ id: "all", label: "ALL" }],
    },
  },
  { timestamps: true }
);

export const ProjectsSection = mongoose.model("ProjectsSection", projectsSectionSchema);
