import {User} from "../models/userModel.js"
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/jwtToken.js" 

export const signup = async(req, res)=>{
 const { fullName, email, password } = req.body;
 if(!fullName || !email || !password){
    return res.status(400).json({
        sucess:false,
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
 
 if(password.length<8 || password.length>16){
    return res.status(400).json({
        sucess:false,
        message:"Password must contain 8 characters and must not contain more than 16 characters..."        
    })
 }
 const isemailAlreadyExists=await User.findOne({email});

 if(isemailAlreadyExists){
    return res.status(400).json({
        sucess:false,
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
    
}

export const signout = async(req, res)=>{
    
}

export const getUser = async(req, res)=>{
    
}

export const updateProfile = async(req, res)=>{
    
}