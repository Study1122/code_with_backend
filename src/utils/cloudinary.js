import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    //Upload image on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    return response;
  } catch (error) {
    console.error("🔥 CLOUDINARY ERROR:", error.message); // 👈 CRITICAL
    return null;
  } finally {
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
  }
};

export { uploadOnCloudinary };
