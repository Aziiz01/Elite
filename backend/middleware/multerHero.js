import multer from "multer";
import os from "os";

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO = ['video/mp4', 'video/webm'];
const ALLOWED_MIMETYPES = [...ALLOWED_IMAGE, ...ALLOWED_VIDEO];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;   // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024;  // 50MB

function fileFilter(req, file, callback) {
    if (ALLOWED_MIMETYPES.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error(`Invalid file type. Allowed: images (jpeg, png, webp), videos (mp4, webm)`), false);
    }
}

function getLimit(req, file) {
    return ALLOWED_VIDEO.includes(file.mimetype) ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
}

const uploadDir = process.env.VERCEL ? "/tmp" : os.tmpdir();

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadDir),
    filename: (req, file, callback) => callback(null, file.originalname)
});

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: MAX_VIDEO_SIZE }
});

export default upload;
