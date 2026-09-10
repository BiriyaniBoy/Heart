import mongoose from "mongoose";

const { Schema } = mongoose;

const phaseSchema = new Schema({
  no: { type: String, required: true },
  key: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  meta: { type: String, default: "" },
});

const processSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "PIPELINE EXECUTION" },
    title: { type: String, default: "How I Ship Production Mobile Products" },
    badge: { type: String, default: "" },
    phases: { type: [phaseSchema], default: [] },
  },
  { timestamps: true }
);

export const ProcessSection = mongoose.model("ProcessSection", processSectionSchema);
