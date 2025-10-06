import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

export const isAuthenticated=async(req, res, next)=>{
    const {usertoken} = req.cookies;
    if(!usertoken){
        return res.status(401).json({
            success:false,
            message:"User not Authenticated..."
        })
    }
    const decoded= jwt.verify(usertoken,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({
            success:false,
            message:"User Verification Authenticated Failed..."
        })
    }
    const user=await User.findOne(decoded.id);
    req.user=user;
    next();
}