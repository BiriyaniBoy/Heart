import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary.js";
import { ApiError } from "./ApiError.js";

/**
 * Streams a buffer (from multer's memory storage) to Cloudinary — no temp
 * files on disk. Returns `{ url, publicId }`, ready to store on a document.
 */
export function uploadBufferToCloudinary(buffer, { folder, resourceType = "image" }) {
  if (!isCloudinaryConfigured) {
    throw new ApiError(
      503,
      "Image uploads are not available yet — Cloudinary credentials haven't been configured."
    );
  }

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, overwrite: true },
      (err, result) => {
        if (err) return reject(err);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
}

/** Best-effort cleanup of a previously uploaded asset. Never throws. */
export async function deleteFromCloudinary(publicId, resourceType = "image") {
  if (!publicId || !isCloudinaryConfigured) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    console.error("[cloudinary] cleanup failed:", err.message);
  }
}
