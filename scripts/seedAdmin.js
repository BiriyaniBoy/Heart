import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Admin } from "../src/models/Admin.js";

async function run() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGO_URI } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.");
  }

  await connectDB(MONGO_URI);

  const email = ADMIN_EMAIL.toLowerCase();
  const passwordHash = await Admin.hashPassword(ADMIN_PASSWORD);

  // Matches on `{}` (any existing admin), not `{ email }` — this app only
  // ever has one admin, so re-running with a new email correctly renames
  // that single account instead of leaving the old email/password behind
  // as an orphaned second account still able to log in.
  const admin = await Admin.findOneAndUpdate(
    {},
    { name: ADMIN_NAME || "Admin", email, passwordHash },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );

  console.log(`[seed:admin] ready — ${admin.email}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("[seed:admin] failed:", err);
  process.exit(1);
});
