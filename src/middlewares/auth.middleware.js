//verify logged in user middleware
import dotenv from "dotenv";
dotenv.config()

import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiErrors} from "../utils/ApiErrors.js";
import {User} from "../models/user.model.js";
import jwt from "jsonwebtoken";

const authMiddleware = asyncHandler(async (req, _, next) => {

    try {
        //get token from cookies
        const token = req.cookies?.accessToken || 
        req.header("Authorization")?.replace("Bearer ", "");
        if(!token){
            throw new ApiErrors(401, "You are not logged in!!!");   
        }
    
        //verify token
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        
        if(!decoded || !decoded._id){
            throw new ApiErrors(401, "Invalid Token. Please login again!!!");
        }
        //get user id from decoded token
        const userId = decoded._id;
    
        //check user exists
        const existingUser = await User.findById(userId).select("-password -refreshTokens");
        if(!existingUser){
            //TODO: logout user from client side
            throw new ApiErrors(404, "This user does not exist!!!");    
        }
    
        //attach user to req object
        req.user = existingUser;
        next(); 
    } catch (err) {
        throw new ApiErrors(401, err?.message || "Invalid Token. Please login again!!!");
    }
    
});

export { authMiddleware };
