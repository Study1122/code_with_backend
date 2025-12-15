import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const cloudCof = cloudinary.config({
    cloud_name: "process.env.CLOUDINARY_CLOUD_NAME",
    api_key: "process.env.CLOUDINARY_API_KEY",
    api_secret: "process.env.CLOUDINARY_API_SECRET"
});

const uploadOnCloudinary = async localFilePath => {
    try {
        if (!localFilePath) return null;
        //upload on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: " true"
        });
        // file is uploaded
        console.log(response.url, "File uploaded succesfuly:)");
        return response;
    } catch (error) {
        fs.unlinkSync(localFilePath); //remove the failed upload and save local device
        return null;
    }
};

export {uploadOnCloudinary}

/*
// temp code

cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/v1651585298/happy_people.jpg",
    {
        product_id: "img_id"
    },
    function (error, result) {
        console.log(result);
    }
);
*/