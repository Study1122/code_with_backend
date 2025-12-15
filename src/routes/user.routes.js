import { Router } from "express";
import { registerUser } from "../controllers/user.controller.js";


const router = Router()


router.route("/register")
.get(req, res)=>res.send("Register is working:)")
.post(registerUser)

export default router
