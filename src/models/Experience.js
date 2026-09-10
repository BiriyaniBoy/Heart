import mongoose from "mongoose";

const { Schema } = mongoose;

const experienceSchema = new Schema(
  {
    period: { type: String, required: true },
    role: { type: String, required: true },
    company: { type: String, required: true },
    focus: { type: String, default: "" },
    status: { type: String, default: "" },
    tag: { type: String, default: "" },
    points: { type: [String], default: [] },
    tech: { type: [String], default: [] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Experience = mongoose.model("Experience", experienceSchema);
