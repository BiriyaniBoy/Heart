import mongoose from "mongoose";

const { Schema } = mongoose;

const companySchema = new Schema(
  {
    monogram: { type: String, required: true, trim: true, maxlength: 6 },
    name: { type: String, required: true, trim: true },
    meta: { type: String, default: "" },
    description: { type: String, default: "" },
    role: { type: String, default: "" },
    period: { type: String, default: "" },
    badge: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Company = mongoose.model("Company", companySchema);
