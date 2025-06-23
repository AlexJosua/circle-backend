import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan lokal
const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, "src/uploads"); // simpan file di sini
  },
  filename: function (_req, file, cb) {
    const ext = path.extname(file.originalname); // dapetin ekstensi file
    const fileName = Date.now() + ext; // kasih nama unik
    cb(null, fileName);
  },
});

// Export middleware upload
export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // maks 50 MB brooow
});
