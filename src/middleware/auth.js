import jwt from "jsonwebtoken";
import { Admin } from "../models/Admin.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Protects mutation routes. Every content GET route stays public (the
 * portfolio site reads without logging in) — only POST/PUT/DELETE and the
 * settings routes go through this. Accepts the token from the httpOnly
 * cookie (browser admin app) or an `Authorization: Bearer` header.
 */
export async function protect(req, res, next) {
  const cookieName = process.env.JWT_COOKIE_NAME || "pf_admin_token";
  const bearer = req.headers.authorization;

  const token =
    req.cookies?.[cookieName] ||
    (bearer?.startsWith("Bearer ") ? bearer.slice(7) : null);

  if (!token) {
    throw new ApiError(401, "Not authenticated");
  }

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  const admin = await Admin.findById(payload.sub);
  if (!admin) {
    throw new ApiError(401, "Not authenticated");
  }

  req.admin = admin;
  next();
}
