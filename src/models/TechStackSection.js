import mongoose from "mongoose";

const { Schema } = mongoose;

const techCardSchema = new Schema({
  icon: { type: String, default: "swap" },
  title: { type: String, required: true },
  tag: { type: String, default: "" },
  description: { type: String, default: "" },
  items: { type: [String], default: [] },
  wide: { type: Boolean, default: false },
  metaLeft: { type: String, default: "" },
  metaRight: { type: String, default: "" },
});

const techStackSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "PRODUCTION INTEGRATION MATRIX" },
    title: { type: String, default: "Technology & Third-Party Integration Ecosystem" },
    description: { type: String, default: "" },
    badge: { type: String, default: "" },
    cards: { type: [techCardSchema], default: [] },
  },
  { timestamps: true }
);

export const TechStackSection = mongoose.model("TechStackSection", techStackSectionSchema);
