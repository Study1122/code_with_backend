import { User } from "../models/user.model.js";
import { ApiErrors } from "../utils/ApiErrors.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import path from "path";

//create a metod for genrating access and rerresh tokens
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiErrors(404, "User not found");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiErrors(500, "Token generation failed");
  }
};
//register user controller
const registerUser = asyncHandler(async (req, res) => {
  //get credientials from req body
  const { username, fullName, email, password } = req.body || {};

  // validation
  if (
    [username, fullName, email, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiErrors(400, "All fields are requied");
  }

  //check user aleady exits
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    throw new ApiErrors(409, "User alerady exists with this email or username");
  }

  //check for images check for avatar
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!avatarLocalPath) {
    throw new ApiErrors(400, "Avatar is required");
  }

  //upload image to cloudinary, avatar'
  const avatarUploadResponse = uploadOnCloudinary(avatarLocalPath);

  if (!avatarUploadResponse?.url) {
    throw new ApiErrors(
      422,
      "Avatar Image upload failed, please try again later"
    );
  }

  let coverImageUploadResponse;

  if (coverImageLocalPath) {
    coverImageUploadResponse = uploadOnCloudinary(coverImageLocalPath);
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
    coverImage: coverImageUploadResponse?.url || "",
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
    .json(new ApiResponse(200, "User registered successfully", createdUser));
});
//login user controller
const loginUser = asyncHandler(async (req, res) => {
  //get credientials from req body
  
  const { email, username, password } = req.body || {};
  //validation
  if (!(email || username)) {
    throw new ApiErrors(400, "Email or username are required!!!");
  } else if (!password) {
    throw new ApiErrors(400, "Password is required!!!");
  }

  //check user exists
  const existingUser = await User.findOne({
    $or: [
      { email: email?.toLowerCase() },
      { username: username?.toLowerCase() },
    ],
  });
  if (!existingUser) {
    throw new ApiErrors(404, "This user does not exist!!!");
  }
  //compare password
  const isPasswordMatched = await existingUser.comparePassword(password);
  if (!isPasswordMatched) {
    throw new ApiErrors(401, "Invalid Password!!!");
  }

  //generate tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    existingUser._id
  );

  //attach refresh token to db
  existingUser.refreshTokens.push(refreshToken);
  await existingUser.save({ validateBeforeSave: false });

  //remove password and refresh token field from reaponse
  const loggedUser = await User.findById(existingUser._id).select(
    "-password -refreshTokens"
  );

  //cookies options
  const cookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookiesOptions)
    .cookie("accessToken", accessToken, cookiesOptions)
    .json(
      new ApiResponse(
        200,
        `${existingUser.username} Login successful`,
        loggedUser
      )
    );
});
//logout user controller
const logoutUser = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  const user = await User.findById(req.user._id);
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== incomingRefreshToken
  );
  //user.refreshTokens = []
  await user.save({ validateBeforeSave: false });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, `${user.username} logged out successfully`));
});
//refreshToken end point
const refreshedAccessToken = asyncHandler(async (req, res) => {
  let incomingRefreshedToken;
  try {
    incomingRefreshedToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshedToken) {
      throw new ApiErrors(401, "Refresh Token missing!!!");
    }
  } catch (err) {
    throw new ApiErrors(401, "User not found or token expired!!, login again", {
      err,
    });
  }

  let decodedRefreshedToken;
  try {
    decodedRefreshedToken = await jwt.verify(
      incomingRefreshedToken,
      process.env.REFRESH_TOKEN_SECRET
    );
  } catch (error) {
    throw new ApiErrors(401, "Invalid refresh tokens!!!", { error });
  }

  //fetch data from db using decodedRefreshedToken
  const user = await User.findById(decodedRefreshedToken?._id);
  //check refresh Tokens
  if (!user || !user.refreshTokens.includes(incomingRefreshedToken)) {
    throw new ApiErrors(401, "Token reuse detected");
  }

  //generate new refresh Token
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  // add new refresh token
  user.refreshTokens = user.refreshTokens.filter(
    (token) => token !== incomingRefreshedToken
  );
  user.refreshTokens.push(refreshToken);

  // save once
  await user.save({ validateBeforeSave: false });

  //cookies options
  const newCookiesOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, newCookiesOptions)
    .cookie("refreshToken", refreshToken, newCookiesOptions)
    .json(
      new ApiResponse(200, `Tokens refreshed successfully`, {
        accessToken,
        refreshToken,
      })
    );
});
//Update Password
const updatePassword = asyncHandler(async (req, res) => {
  
  console.log(req.cookies?.refreshToken)
  //get password ceedntials
  const { pass, newPass, confPass } = req.body || {};
  //verify credientials
  if (!pass || !newPass || !confPass) {
    throw new ApiErrors(400, "All field required!!");
  }
  //newPass and confPass compaire
  if (newPass !== confPass) {
    throw new ApiErrors(400, "Password did not matched!!");
  }
  //get pass from req

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new ApiErrors(404, "User not found!!");
  }
  //compaire db password with entered pass
  let isPasswordMatched = await user.comparePassword(pass);
  if (!isPasswordMatched) {
    throw new ApiErrors(401, "Wronge Password!!!");
  }

  user.password = newPass;
  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });
  //save new pass to db

  //send res
  res
    .status(200)
    .clearCookie("accessToken")
    //.clearCookie("refreshToken")
    .json(new ApiResponse(200, "Password updated successfully"));
});
//Update user credantials
const userAccountDetails = asyncHandler(async (req, res) => {
  //get creds from user body
  const { email, fullName } = req.body || {};
  if (!email || !fullName) {
    throw new ApiErrors(400, "All field required!!");
  }

  //const updateUser = await User.findById(req.user._id)
  //updateUser.fullName = fullName
  //updateUser.email = email
  //await updateUser.save({validateBeforeSave: true})

  ///////////////////////(or)///////////////////////////////////

  const updateUser = await User.findByIdAndUpdate(
    req.user._id,
    { email, fullName },
    { new: true, runValidators: true }
  ).select("-password -refreshTokens");

  if (!updateUser) {
    throw new ApiErrors(400, "User not logged In!!");
  }

  res
    .status(200)
    .json(
      new ApiResponse(200, "Account updated successfully", { user: updateUser })
    );
});
//avatar file update
const updateAvatar = asyncHandler(async (req, res) =>{
  const avatarLocalPath = req.file?.path;
  if(!avatarLocalPath){
    throw new ApiErrors(400, "Avatar file not found!!")
  }
  console.log("avatarLocalPath:", avatarLocalPath)
  const avatar = await uploadOnCloudinary(avatarLocalPath)
  console.log("Cloudinary respond:", avatar)
  if(!avatar?.url){
    throw new ApiErrors(400, "Error while uploading avatar!")
  }
  
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {avatar: avatar?.url},
    {new: true}
  ).select("-password -refreshTokens")
  

/*  const user = await User.findByIdAndUpdate(req.user._id, {
      avatar: avatar.url
    },
    {new: true}
  ).select("-password")
*/
  
  
  res
  .status(200)
  .json(new ApiResponse(200, "Avatar uploaded successfully", {user}))
});
//cover image file update
const updateCoverImage = asyncHandler( async (req, res)=>{
  const coverImagePath = req.file?.path
  if(!coverImagePath){
      throw new ApiErrors(400, "Cover Image file not found!!")
  }
  
  const coverImage = await uploadOnCloudinary(coverImagePath)
  if(!coverImage){
      throw new ApiErrors(400, "Error uploading Cover Image on Cloudinary!!")
  }
  
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {coverImage: coverImage?.url},
    {new: true}
  ).select("-password -refreshTokens")
  
  res
  .status(200)
  .json(new ApiResponse(200, "Cover image uploaded successfully!!", {user}))
  
});
//Current user
const currentUser = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const user = await User.findById(userId).select("-password -refreshTokens");
  if (!user) {
    throw new ApiErrors(401, "User not logged in!!");
  }

  res.status(200).json(new ApiResponse(200, `Hello ${user.fullName}`, user));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshedAccessToken,
  updatePassword,
  userAccountDetails,
  updateAvatar,
  updateCoverImage,
  currentUser
};
