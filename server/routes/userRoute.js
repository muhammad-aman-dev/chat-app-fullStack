import express from "express";
import { signin, signout, signup, updateProfile, getUser } from "../controllers/userController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import { transportmail } from "../controllers/userController.js";
import { changePass, searchUser } from "../controllers/userController.js";

const router=express.Router();

router.post("/signup", signup)
router.post("/signin", signin)
router.get("/signout", isAuthenticated, signout)
router.get("/me", isAuthenticated, getUser)
router.put("/updateprofile", isAuthenticated, updateProfile)
router.post("/getotp", transportmail)
router.post("/changepass", changePass)
router.post("/search", isAuthenticated, searchUser)


export default router;