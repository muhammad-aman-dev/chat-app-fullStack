import express from "express";
import { signin, signout, signup, updateProfile, getUser } from "../controllers/userController.js";

const router=express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.get("/signout",signout)
router.get("/me",getUser)
router.put("/updateprofile",updateProfile)



export default router;