import { Profile } from "../models/Profile.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import { ApiError } from "../utils/ApiError.js";

export const { get: getProfile, update: updateProfile } = createSingletonController(Profile);

const DEFAULT_AVATAR_URL = "/images/profile.svg";

export async function updateAvatar(req, res) {
  if (!req.file) throw new ApiError(400, "No image file uploaded (field name: image)");

  let doc = await Profile.findOne();
  if (!doc) doc = new Profile();

  const previousPublicId = doc.avatar?.publicId;
  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "subhojit-portfolio/avatar",
  });

  // The admin can frame the photo before pressing Upload — `x`/`y` come
  // along in the same multipart request as the crop the admin chose.
  // Falls back to the previous position (or center) if omitted, so older
  // callers that don't send a crop still work.
  const x = Number(req.body.x);
  const y = Number(req.body.y);
  const hasPosition = Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 100 && y >= 0 && y <= 100;

  // Assigning the whole `avatar` object (rather than .set on a sub-path)
  // resets any field left out to its schema default — position included —
  // so it has to be explicitly carried over, not just url/publicId/alt.
  doc.avatar = {
    url,
    publicId,
    alt: doc.avatar?.alt || doc.name,
    position: hasPosition ? { x, y } : doc.avatar?.position || { x: 50, y: 50 },
  };
  await doc.save();

  await deleteFromCloudinary(previousPublicId);
  res.json({ success: true, data: doc });
}

/** Adjusts where the photo is anchored within its frame, without re-uploading. */
export async function updateAvatarPosition(req, res) {
  const x = Number(req.body.x);
  const y = Number(req.body.y);
  if (!Number.isFinite(x) || !Number.isFinite(y) || x < 0 || x > 100 || y < 0 || y > 100) {
    throw new ApiError(400, "`x` and `y` must be numbers between 0 and 100");
  }

  let doc = await Profile.findOne();
  if (!doc) doc = new Profile();

  doc.avatar = { ...doc.avatar.toObject(), position: { x, y } };
  await doc.save();
  res.json({ success: true, data: doc });
}

/** Removes the uploaded photo from Cloudinary and reverts to the placeholder. */
export async function deleteAvatar(req, res) {
  const doc = await Profile.findOne();
  if (!doc?.avatar?.publicId) {
    throw new ApiError(400, "No uploaded avatar to delete");
  }

  await deleteFromCloudinary(doc.avatar.publicId);
  doc.avatar = { url: DEFAULT_AVATAR_URL, publicId: null, alt: doc.name, position: { x: 50, y: 50 } };
  await doc.save();

  res.json({ success: true, data: doc });
}
