import mongoose from "mongoose";

const { Schema } = mongoose;

const ctaSchema = new Schema({ label: String, href: String }, { _id: false });
const metricSchema = new Schema({ label: String, value: String }, { _id: false });

const specTileSchema = new Schema(
  { label: String, value: String, meta: String },
  { _id: false }
);

const profileSchema = new Schema(
  {
    name: { type: String, default: "Subhojit Das" },
    firstName: { type: String, default: "Subhojit" },
    role: { type: String, default: "Senior React Native Developer" },
    title: { type: String, default: "React Native Specialist & Mobile Systems Engineer" },
    availabilityPill: { type: String, default: "AVAILABLE FOR REACT NATIVE & MOBILE ROLES" },
    availabilityBadge: { type: String, default: "AVAILABLE FOR SENIOR MOBILE ROLES" },
    headline: { type: [String], default: ["Building Zero-Jank &", "Ultra-Fluid Mobile Apps."] },
    intro: { type: String, default: "" },
    primaryCta: { type: ctaSchema, default: () => ({}) },
    secondaryCta: { type: ctaSchema, default: () => ({}) },
    avatar: {
      url: { type: String, default: "/images/profile.svg" },
      publicId: { type: String, default: null },
      alt: { type: String, default: "Subhojit Das" },
      // Where the photo is anchored within its (cropped) frame — percentages,
      // matching CSS object-position. Lets the admin fix a photo whose
      // important part (e.g. the top of the head) would otherwise be cropped
      // out by the frame's fixed aspect ratio, without re-uploading.
      position: {
        x: { type: Number, default: 50, min: 0, max: 100 },
        y: { type: Number, default: 50, min: 0, max: 100 },
      },
    },
    card: {
      statusTag: { type: String, default: "LIVE // NODE_ACTIVE" },
      envTag: { type: String, default: "" },
      nameTag: { type: String, default: "" },
      roleTag: { type: String, default: "" },
      engineTag: { type: String, default: "HERMES JSI ENGINE" },
      metrics: { type: [metricSchema], default: [] },
    },
    specTiles: { type: [specTileSchema], default: [] },
    heroPills: { type: [String], default: [] },
    specializations: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const Profile = mongoose.model("Profile", profileSchema);
