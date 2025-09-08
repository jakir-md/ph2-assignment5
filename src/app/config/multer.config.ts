/* eslint-disable no-useless-escape */
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";
const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: {
    public_id: (req, file) => {
      const filename = file.originalname
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/\./g, "-")
        .replace(/[^a-z0-9\-\.]/g, "")
        .split("-");

      filename.pop();
      filename.join("-");

      const uniqueFilename =
        Math.random().toString(36).substring(2) +
        "-" +
        Date.now() +
        "-" +
        filename;
      return uniqueFilename;
    },
  },
});

export const multerUpload = multer({ storage });
