import mongoose from "mongoose";

const { Schema } = mongoose;

/** Content/labels for the contact form — not the submitted messages themselves. */
const contactSectionSchema = new Schema(
  {
    eyebrow: { type: String, default: "ENGAGEMENT TRANSMISSION" },
    title: { type: String, default: "Initiate Direct Inquiry" },
    description: { type: String, default: "" },
    email: { type: String, default: "" },
    engagementTypes: { type: [String], default: [] },
    secureNote: { type: String, default: "256-BIT ENCRYPTED DISPATCH" },
    submitLabel: { type: String, default: "Transmit Message" },
  },
  { timestamps: true }
);

export const ContactSection = mongoose.model("ContactSection", contactSectionSchema);
