import multer from "multer";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif"]);
const DOC_TYPES = new Set(["application/pdf"]);

const storage = multer.memoryStorage();

function fileFilter(allowed) {
  return (req, file, cb) => {
    if (allowed.has(file.mimetype)) return cb(null, true);
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", `Unsupported file type: ${file.mimetype}`));
  };
}

/** Single image upload, field name "image", 8MB cap. */
export const uploadImage = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: fileFilter(IMAGE_TYPES),
}).single("image");

/** Single PDF upload, field name "file", 15MB cap. */
export const uploadDocument = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: fileFilter(DOC_TYPES),
}).single("file");
