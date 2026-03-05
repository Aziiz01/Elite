import multer from "multer";
import os from "os";

// Vercel serverless: only /tmp is writable; locally use system temp
const uploadDir = process.env.VERCEL ? "/tmp" : os.tmpdir();

const storage = multer.diskStorage({
    destination: (req, file, callback) => callback(null, uploadDir),
    filename: (req, file, callback) => callback(null, file.originalname)
});

const upload = multer({ storage });

export default upload;