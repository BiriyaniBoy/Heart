import mongoose from "mongoose";

const { Schema } = mongoose;

const skillColumnSchema = new Schema({
  icon: { type: String, default: "device" },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  items: { type: [String], default: [] },
  meta: { type: String, default: "" },
});

const skillsSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "CORE CAPABILITIES" },
    title: { type: String, default: "Technical Proficiency & Architecture Matrix" },
    description: { type: String, default: "" },
    columns: { type: [skillColumnSchema], default: [] },
  },
  { timestamps: true }
);

export const SkillsSection = mongoose.model("SkillsSection", skillsSectionSchema);
