import jwt from "jsonwebtoken";

/** Signs a JWT carrying the admin's id. */
export function generateToken(adminId) {
  return jwt.sign({ sub: String(adminId) }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}
