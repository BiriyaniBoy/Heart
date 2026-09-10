import mongoose from "mongoose";

const { Schema } = mongoose;

const backgroundSchema = new Schema(
  {
    url: { type: String, default: null },
    publicId: { type: String, default: null },
    // Darkness of the scrim laid over the image (0 = image fully visible,
    // no readability overlay; 100 = nearly opaque). Admin-adjustable via
    // +/- controls on the Appearance page.
    overlayOpacity: { type: Number, default: 80, min: 0, max: 100 },
  },
  { _id: false }
);

/** Admin-app-only settings — the two customizable background images. */
const settingsSchema = new Schema(
  {
    adminLoginBackground: { type: backgroundSchema, default: () => ({}) },
    adminHomeBackground: { type: backgroundSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
