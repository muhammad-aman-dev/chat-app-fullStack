import {User} from "../models/userModel.js"
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/jwtToken.js" 

export const signup = async(req, res)=>{
 const { fullName, email, password } = req.body;
 if(!fullName || !email || !password){
    return res.status(400).json({
        success:false,
        message:"Please provide all details..."
    })
 }
 const emailRejex= /^\S+@\S+\.\S+$/ ;
 if(!emailRejex.test(email)){
    return res.status(400).json({
        success:false,
        message:"Invalid Email..."        
    })
 }
 
 if(password.length<8 || password.length>16){
    return res.status(400).json({
        success:false,
        message:"Password must contain 8 characters and must not contain more than 16 characters..."        
    })
 }
 const isemailAlreadyExists=await User.findOne({email});

 if(isemailAlreadyExists){
    return res.status(400).json({
        success:false,
        message:"User with this Email Already Exists..."        
    })
 }
 
 const hashedPass=await bcrypt.hash(password,10)

 const user=await User.create({
    fullName,
    email,
    password : hashedPass,
    avatar: {
        id: "",
        url: ""
    }
 })

 generateToken(user, "User Generated Successfully...", 200, res);

}

export const signin = async(req, res)=>{
    const {email, password} =req.body;
    if(!email || !password){
    return res.status(400).json({
        success:false,
        message:"Please provide all details..."
    })
 }
    const emailRejex= /^\S+@\S+\.\S+$/ ;
 if(!emailRejex.test(email)){
    return res.status(400).json({
        sucess:false,
        message:"Invalid Email..."        
    })
 }

 let user=await User.findOne({email});
 if(!user){
    return res.status(400).json({
        success:false,
        message:"No user with this email exists..."
    })
 }
 const isPassword=await bcrypt.compare(password,user.password);
 if(!isPassword){
    return res.status(400).json({
        success:false,
        message:"Wrong Password Entered..."
    })
 }
 generateToken(user, "Login Successfully", 200, res)

}

export const signout = async(req, res)=>{
    res.status(200).cookie("usertoken","",{
        maxAge : 0,
        httpsOnly : true,
        sameSite : "strict",
        secure : process.env.CURR_STATUS !== "development" ? true : false,
    }).json({
        success:true,
        message: "User Logged Out Successfully"
    })
}

export const getUser = async(req, res)=>{
    
}

export const updateProfile = async(req, res)=>{
    
}