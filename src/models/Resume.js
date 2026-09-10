import mongoose from "mongoose";

const { Schema } = mongoose;

const resumeSchema = new Schema(
  {
    eyebrow: { type: String, default: "VERIFIED RESUME" },
    badge: { type: String, default: "" },
    name: { type: String, default: "Subhojit Das" },
    title: { type: String, default: "" },
    file: {
      url: { type: String, default: "/Subhojit_Das_Resume.pdf" },
      publicId: { type: String, default: null },
      name: { type: String, default: "" },
      size: { type: String, default: "" },
      meta: { type: String, default: "" },
    },
    highlights: { type: [String], default: [] },
    downloadLabel: { type: String, default: "Download PDF CV" },
    copyLabel: { type: String, default: "Copy Email" },
  },
  { timestamps: true }
);

export const Resume = mongoose.model("Resume", resumeSchema);
