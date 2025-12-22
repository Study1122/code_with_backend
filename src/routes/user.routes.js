// set routes
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { registerUser, loginUser, logoutUser, 
         refreshedAccessToken, updatePassword, 
         userAccountDetails, currentUser } from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  //middleware ;- upload a filed name 'avatar' and 'coverImage' from form-data
  upload.fields([
      {name: 'avatar', maxCount: 1},
      {name: 'coverImage', maxCount: 1}
  ]),
  registerUser);

router.route("/login").post(
  loginUser
);

router.route("/logout").post(
  authMiddleware,
  logoutUser
);

router.route("/refresh_token").post(
  refreshedAccessToken
)

router.route("/update_password").post(
  authMiddleware,
  updatePassword
)

router.route("/update_account").post(
  authMiddleware,
  userAccountDetails
)

router.route("/").post(
  authMiddleware,
  currentUser
)
export default router