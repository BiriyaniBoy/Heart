import { Settings } from "../models/Settings.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import { ApiError } from "../utils/ApiError.js";

export const { get: getSettings, update: updateSettings } = createSingletonController(Settings);

const FIELD_BY_TARGET = {
  login: "adminLoginBackground",
  home: "adminHomeBackground",
};

function fieldForTarget(target) {
  const field = FIELD_BY_TARGET[target];
  if (!field) throw new ApiError(400, '`target` must be "login" or "home"');
  return field;
}

/** Uploads a new admin background image. `target` in the body: "login" | "home". */
export async function updateBackground(req, res) {
  const field = fieldForTarget(req.body.target);
  if (!req.file) throw new ApiError(400, "No image file uploaded (field name: image)");

  let doc = await Settings.findOne();
  if (!doc) doc = new Settings();

  const previousPublicId = doc[field]?.publicId;
  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "subhojit-portfolio/admin-backgrounds",
  });

  // Assigning the whole field (rather than .set on a sub-path) resets
  // anything left out to its schema default, so the admin's tuned overlay
  // opacity has to be explicitly carried over rather than reset to 80 on
  // every re-upload.
  doc[field] = { url, publicId, overlayOpacity: doc[field]?.overlayOpacity ?? 80 };
  await doc.save();

  await deleteFromCloudinary(previousPublicId);
  res.json({ success: true, data: doc });
}

/** Nudges how dark the readability scrim over one background is, 0-100. */
export async function updateOverlayOpacity(req, res) {
  const field = fieldForTarget(req.body.target);
  const opacity = Number(req.body.overlayOpacity);
  if (!Number.isFinite(opacity) || opacity < 0 || opacity > 100) {
    throw new ApiError(400, "`overlayOpacity` must be a number between 0 and 100");
  }

  let doc = await Settings.findOne();
  if (!doc) doc = new Settings();

  doc[field] = { ...doc[field].toObject(), overlayOpacity: opacity };
  await doc.save();
  res.json({ success: true, data: doc });
}

/** Removes an admin background image from Cloudinary and clears it. */
export async function deleteBackground(req, res) {
  const field = fieldForTarget(req.body.target);

  const doc = await Settings.findOne();
  if (!doc?.[field]?.publicId) {
    throw new ApiError(400, "No uploaded background to delete");
  }

  await deleteFromCloudinary(doc[field].publicId);
  doc[field] = { url: null, publicId: null, overlayOpacity: doc[field].overlayOpacity };
  await doc.save();

  res.json({ success: true, data: doc });
}

/** Uploads the admin's own photo — shown in the topbar and the login mark. */
export async function updateAdminAvatar(req, res) {
  if (!req.file) throw new ApiError(400, "No image file uploaded (field name: image)");

  let doc = await Settings.findOne();
  if (!doc) doc = new Settings();

  const previousPublicId = doc.adminAvatar?.publicId;
  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "subhojit-portfolio/admin-avatar",
  });

  doc.adminAvatar = { url, publicId };
  await doc.save();

  await deleteFromCloudinary(previousPublicId);
  res.json({ success: true, data: doc });
}

/** Removes the admin's photo from Cloudinary and reverts to the default icon mark. */
export async function deleteAdminAvatar(req, res) {
  const doc = await Settings.findOne();
  if (!doc?.adminAvatar?.publicId) {
    throw new ApiError(400, "No uploaded photo to delete");
  }

  await deleteFromCloudinary(doc.adminAvatar.publicId);
  doc.adminAvatar = { url: null, publicId: null };
  await doc.save();

  res.json({ success: true, data: doc });
}
