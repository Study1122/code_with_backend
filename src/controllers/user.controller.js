import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const registerUser = asyncHandler(async (req, res, next) => {
    //get credientials from req body
    const { username, fullName, email, password } = req.body || {};

    // validation
    if (
        [username, fullName, email, password].some(
            fields => fields?.trim() === ""
        )
    ) {
        throw new ApiErrors(400, "All fields are requied");
    }

    //check user aleady exits
    const existingUser = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (existingUser) {
        throw new ApiErrors(
            409,
            "User alerady exists with this email or username"
        );
    }

    //check for images check for avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    if (!avatarLocalPath) {
        throw new ApiErrors(400, "Avatar is required");
    }

    //upload image to cloudinary, avatar'
    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath);

    if (!avatarUploadResponse?.url) {
        //console.log("FILES →", req.files);
        throw new ApiErrors(
            422,
            "Avatar Image upload failed, please try again later"
        );
    }

    let coverImageUploadResponse;

    if (coverImageLocalPath) {
        coverImageUploadResponse =
            await uploadOnCloudinary(coverImageLocalPath);
        if (!coverImageUploadResponse?.url) {
            throw new ApiErrors(
                422,
                "Cover Image upload failed, please try again later"
            );
        }
    }

    //create user object and save to db
    const newUser = await User.create({
        username: username.toLowerCase(),
        fullName,
        email,
        password,
        avatar: avatarUploadResponse.url,
        coverImage: coverImageUploadResponse?.url || ""
    });

    //remove password and refresh token field from reaponse
    const createdUser = await User.findById(newUser._id).select(
        "-password -refreshTokens"
    );

    //check for user created successfully
    if (!createdUser) {
        throw new ApiErrors(
            500,
            "User registration failed, Please try again later"
        );
    }

    // respond to client
    return res
        .status(201)
        .json(
            new ApiResponse(200, "User registered successfully", createdUser)
        );
});
export { registerUser };
