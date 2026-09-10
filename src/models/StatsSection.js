import mongoose from "mongoose";

const { Schema } = mongoose;

const statItemSchema = new Schema({
  tag: { type: String, required: true },
  value: { type: String, required: true },
  label: { type: String, required: true },
});

const statsSectionSchema = new Schema(
  {
    items: { type: [statItemSchema], default: [] },
  },
  { timestamps: true }
);

export const StatsSection = mongoose.model("StatsSection", statsSectionSchema);
