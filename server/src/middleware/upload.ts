import multer from "multer";

// Multer middleware -> memory buffer -> forwarded to Cloudinary in controller
// PDF constraint: images must be optimized before upload (max 2MB)
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image uploads are allowed"));
    }
    cb(null, true);
  },
});
