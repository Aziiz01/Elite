import multer from "multer";
import os from "os";

const ALLOWED_MIMETYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function fileFilter(req, file, callback) {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type. Allowed: ${ALLOWED_MIMETYPES.join(', ')}`), false);
    }
}

// Vercel serverless: only /tmp is writable; locally use system temp
const uploadDir = process.env.VERCEL ? "/tmp" : os.tmpdir();

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadDir),
    filename: (req, file, callback) => callback(null, file.originalname)
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_FILE_SIZE }
});

export default upload;