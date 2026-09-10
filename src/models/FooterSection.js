import mongoose from "mongoose";

const { Schema } = mongoose;

const jumpSchema = new Schema({ label: String, href: String });

const footerSectionSchema = new Schema(
  {
    description: { type: String, default: "" },
    jumpsTitle: { type: String, default: "ARCHITECTURE JUMPS" },
    jumps: { type: [jumpSchema], default: [] },
    statusTitle: { type: String, default: "STATUS & TELEMETRY" },
    statusLabel: { type: String, default: "" },
    statusLines: { type: [String], default: [] },
    version: { type: String, default: "" },
    rights: { type: String, default: "" },
    bottomLinks: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const FooterSection = mongoose.model("FooterSection", footerSectionSchema);
