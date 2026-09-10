import { Admin } from "../models/Admin.js";
import { generateToken } from "../utils/generateToken.js";
import { ApiError } from "../utils/ApiError.js";

const cookieName = () => process.env.JWT_COOKIE_NAME || "pf_admin_token";

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

export async function login(req, res) {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  const valid = admin && (await admin.comparePassword(password));
  if (!valid) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = generateToken(admin._id);
  res.cookie(cookieName(), token, cookieOptions());
  res.json({
    success: true,
    data: {
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    },
  });
}

export async function logout(req, res) {
  res.clearCookie(cookieName(), { ...cookieOptions(), maxAge: 0 });
  res.json({ success: true, data: null });
}

export async function me(req, res) {
  res.json({
    success: true,
    data: { id: req.admin._id, name: req.admin.name, email: req.admin.email },
  });
}
