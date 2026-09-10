import mongoose from "mongoose";

const { Schema } = mongoose;

/** Wrapper text for the "Trusted By" section — the Company entities themselves live in Company.js. */
const companiesSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "CLIENT ORGANIZATIONS & COMMERCIAL PARTNERSHIPS" },
    title: { type: String, default: "Trusted By & Contracted Across High-Growth Tech Companies" },
    badge: { type: String, default: "" },
  },
  { timestamps: true }
);

export const CompaniesSection = mongoose.model("CompaniesSection", companiesSectionSchema);
