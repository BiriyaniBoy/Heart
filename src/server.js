import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

async function start() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not set — copy .env.example to .env and fill it in.");
  }
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not set — copy .env.example to .env and fill it in.");
  }

  await connectDB(process.env.MONGO_URI);
  console.log("[db] connected");

  const server = app.listen(PORT, () => {
    console.log(`[server] listening on port ${PORT} (${process.env.NODE_ENV || "development"})`);
  });

  const shutdown = (signal) => {
    console.log(`[server] ${signal} received, shutting down`);
    server.close(() => process.exit(0));
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

process.on("unhandledRejection", (err) => {
  console.error("[unhandledRejection]", err);
  process.exit(1);
});

start().catch((err) => {
  console.error("[startup failed]", err);
  process.exit(1);
});
