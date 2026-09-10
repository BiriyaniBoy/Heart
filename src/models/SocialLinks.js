import mongoose from "mongoose";

const { Schema } = mongoose;

const socialLinkSchema = new Schema({
  label: { type: String, required: true },
  href: { type: String, required: true },
  icon: { type: String, default: "link" },
});

const socialLinksSchema = new Schema(
  {
    // Hero section's compact icon row.
    primary: { type: [socialLinkSchema], default: [] },
    // Footer's fuller icon row.
    footer: { type: [socialLinkSchema], default: [] },
  },
  { timestamps: true }
);

export const SocialLinks = mongoose.model("SocialLinks", socialLinksSchema);
