import {User} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

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
    const user=req.user;
    return res.status(200).json({
        success:true,
        user,
    })
}

export const updateProfile = async(req, res)=>{
    const { fullName }= req.body;
    if(fullName.trim().length === 0){
     return res.status(400).json({
        success:false,
        message:"Edited Details are Invalid..."
     })
    }
    const avatar=req?.files?.avatar;
    let cloudinaryResponse={};

    if(avatar){
        try{
            const oldID=req?.user?.avatar?.id;
            if(oldID && oldID.length>0){
            await cloudinary.uploader.destroy(oldID)
        }
        cloudinaryResponse=await cloudinary.uploader.upload(avatar.tempFilePath,{
            folder:"CHAT_APP_DP",
            transformation:[
                {width:300, height:300, crop:"limit"},
                {quality: "auto"},
                {fetch_format: "auto"}
            ],
        })
        }
        catch(err){
        console.error("Cloudinary Upload Error: ",err);
        return res.status(500).json({
            success: false,
            message: "Failed to Upload Avatar..."
        });
        }
    }
    let data ={
        fullName,
    }
    let user=await User.findOne({_id:req.user._id});
    if(avatar && cloudinaryResponse?.public_id && cloudinaryResponse?.secure_url){
        user.avatar.id= cloudinaryResponse.public_id;
        user.avatar.url= cloudinaryResponse.secure_url;
    }
    user.fullName=data?.fullName;
    await user.save();

    return res.status(200).json({
        success:true,
        message:"User Updated Successfully....",
        url:cloudinaryResponse.secure_url || "",
    })

}


export const transportmail = async (req, res) => {
  const { email,type} = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  let newhtml;
  if(type=='sign up'){
    newhtml=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>OTP Email</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 30px;">
              <!-- ✅ LOGO -->
              <img src="https://res.cloudinary.com/dii4fqc0r/image/upload/v1752464173/Doctor-removebg-preview_fxyzoo.png" alt="Doctor Online Logo" width="120" style="display: block; margin-bottom: 20px;" />
              <!-- ✅ HEADING -->
              <h1 style="color: #2d3748;">Thanks for Signing Up!</h1>
              <p style="color: #4a5568; font-size: 16px;">Welcome to <strong>Doctor Online</strong>. We're glad to have you!</p>
              <!-- ✅ OTP -->
              <div style="margin: 30px 0;">
                <p style="color: #2d3748; font-size: 16px;">Your OTP for Sign Up is:</p>
                <div style="font-size: 28px; font-weight: bold; color: #3182ce; letter-spacing: 4px; background-color: #ebf8ff; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                  ${otp}
                </div>
              </div>
              <p style="color: #718096; font-size: 14px;">Please use this OTP and do not share to anyone. If you didn't request this, just ignore this email.</p>
              <!-- ✅ Footer -->
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #a0aec0;">&copy; 2025 Doctor Online. All rights reserved.</p>
              <p style="font-size: 12px; color: #a0aec0;">Contact us at <a href="mailto:amanmuhammad567@gmail.com" style="color: #3182ce;">amanmuhammad567@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>  
</body>
</html>`
  }
  if(type=='password forget'){
    newhtml=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Password Reset</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <tr>
            <td align="center" style="padding: 30px;">
              <!-- ✅ Logo -->
              <img src="https://res.cloudinary.com/dii4fqc0r/image/upload/v1752464173/Doctor-removebg-preview_fxyzoo.png" alt="Doctor Online Logo" width="120" style="display: block; margin-bottom: 20px;" />
              
              <!-- ✅ Heading -->
              <h2 style="color: #2d3748;">Password Reset Request</h2>
              <p style="color: #4a5568; font-size: 16px;">We received a request to reset your password.</p>
              
              <!-- ✅ OTP Section -->
              <div style="margin: 30px 0;">
                <p style="color: #2d3748; font-size: 16px;">Use the following OTP to reset your password:</p>
                <div style="font-size: 28px; font-weight: bold; color: #e53e3e; letter-spacing: 4px; background-color: #fff5f5; padding: 10px 20px; border-radius: 6px; display: inline-block;">
                  ${otp}
                </div>
              </div>

              <!-- ✅ Reminder -->
              <p style="color: #718096; font-size: 14px;">This OTP is valid for a limited time. If you didn’t request a password reset, you can safely ignore this email.</p>

              <!-- ✅ Footer -->
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #e2e8f0;" />
              <p style="font-size: 12px; color: #a0aec0;">&copy; 2025 Doctor Online. All rights reserved.</p>
              <p style="font-size: 12px; color: #a0aec0;">
                Contact support: 
                <a href="mailto:amanmuhammad567@gmail.com" style="color: #3182ce;">amanmuhammad567@gmail.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>  
</body>
</html>`
  }
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Verify Your Email - WeChat",
    html: newhtml,
  };
  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log(err);
      return res.status(400).send("Some Error Occurred.");
    }
    console.log(email + " " + otp);
    let log=new logs({
      mail:email,
      Otp:otp
    })
    await log.save();
    return res.status(200).send(`${otp}`);
  });
};