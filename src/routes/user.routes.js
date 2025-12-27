// set routes
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshedAccessToken,
  updatePassword,
  userAccountDetails,
  updateAvatar,
  updateCoverImage,
  currentUser,
  getSubscribersDetails,
  getWatchHistory
} from "../controllers/user.controller.js";

const router = Router();

router.route("/register").post(
  //middleware ;- upload a filed name 'avatar' and 'coverImage' from form-data
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.route("/login").post(loginUser);

router.route("/logout").post(authMiddleware, logoutUser);

router.route("/refresh_token").post(refreshedAccessToken);

router.route("/update_password").patch(authMiddleware, updatePassword);

router.route("/update_account").patch(authMiddleware, userAccountDetails);

router.route("/update_avatar")
.patch(
  upload.single("avatar"),
  authMiddleware,
  updateAvatar
)
router.route("/update_cover_image")
.patch(
  upload.single("coverImage"),
  authMiddleware,
  updateCoverImage
)

router.route("/").get(authMiddleware, currentUser);

router.route("/subscriber_details/:username").get(authMiddleware, getSubscribersDetails);

router.route("/watch_history/:username").get(authMiddleware, getWatchHistory);

export default router;
