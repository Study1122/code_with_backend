import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

console.log("CLOUDINARY ENV CHECK →", {
  name: process.env.CLOUDINARY_CLOUD_NAME,
  key: process.env.CLOUDINARY_API_KEY ? "OK" : "MISSING",
  secret: process.env.CLOUDINARY_API_SECRET ? "OK" : "MISSING",
});


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        //upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });
        // file is uploaded
        console.log(response.url, "File uploaded successfuly:)");
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the failed upload and save local device
        return null;
    }
};

export {uploadOnCloudinary}

