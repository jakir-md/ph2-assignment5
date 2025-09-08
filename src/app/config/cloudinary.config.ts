import { v2 as Cloudinary } from "cloudinary";
import { EnvVars } from "./env";

Cloudinary.config({
  api_key: EnvVars.CLOUDINARY_API_KEY,
  api_secret: EnvVars.CLOUDINARY_API_SECRET,
  cloud_name: EnvVars.CLOUDINARY_CLOUD_NAME,
});

export const cloudinaryUpload = Cloudinary;