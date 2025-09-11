// server/middlewares/upload.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// ESM doesn't have __dirname by default, recreate it:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsRoot = path.join(__dirname, "..", "uploads");
const brandsDir = path.join(uploadsRoot, "brands");

// ensure directories exist
fs.mkdirSync(brandsDir, { recursive: true });

// sanitize filename helper
function sanitizeFilename(name) {
  return name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_.]/g, "");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, brandsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const filename = `${Date.now()}-${sanitizeFilename(base)}${ext}`;
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export default upload;
