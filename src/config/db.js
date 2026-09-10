import dns from "node:dns";
import mongoose from "mongoose";

/**
 * Connects to MongoDB. Call once from server.js before listening.
 * Mongoose queues operations until the connection is ready, but we still
 * connect eagerly so a bad URI fails fast on boot instead of on first request.
 */
export async function connectDB(uri) {
  mongoose.set("strictQuery", true);

  // `mongodb+srv://` needs a DNS SRV lookup to find the cluster's real hosts.
  // Some resolvers — seen both here and on Windows — refuse that specific
  // query type (querySrv ECONNREFUSED) even though ordinary lookups work
  // fine. Pointing Node's resolver at public DNS fixes it reliably and is
  // harmless for a server that only ever talks to public internet services
  // (Atlas, Cloudinary).
  if (uri.startsWith("mongodb+srv://")) {
    dns.setServers(["8.8.8.8", "1.1.1.1"]);
  }

  const conn = await mongoose.connect(uri);
  return conn.connection;
}
