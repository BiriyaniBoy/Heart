import mongoose from "mongoose";

const { Schema } = mongoose;

/** Wrapper text for the career timeline — entries live in Experience.js. */
const experienceSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "TRACK RECORD" },
    title: { type: String, default: "Career & Systems Leadership" },
    badge: { type: String, default: "" },
  },
  { timestamps: true }
);

export const ExperienceSection = mongoose.model("ExperienceSection", experienceSectionSchema);
