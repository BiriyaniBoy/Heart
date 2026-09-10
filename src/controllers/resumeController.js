import { Resume } from "../models/Resume.js";
import { createSingletonController } from "../utils/singletonFactory.js";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";
import { ApiError } from "../utils/ApiError.js";

export const { get: getResume, update: updateResume } = createSingletonController(Resume);

export async function updateResumeFile(req, res) {
  if (!req.file) throw new ApiError(400, "No PDF uploaded (field name: file)");

  let doc = await Resume.findOne();
  if (!doc) doc = new Resume();

  const previousPublicId = doc.file?.publicId;
  const { url, publicId } = await uploadBufferToCloudinary(req.file.buffer, {
    folder: "subhojit-portfolio/resume",
    resourceType: "raw",
  });

  const sizeMb = (req.file.size / (1024 * 1024)).toFixed(1);
  doc.file = {
    url,
    publicId,
    name: req.file.originalname,
    size: `${sizeMb} MB`,
    meta: doc.file?.meta || "",
  };
  await doc.save();

  await deleteFromCloudinary(previousPublicId, "raw");
  res.json({ success: true, data: doc });
}
