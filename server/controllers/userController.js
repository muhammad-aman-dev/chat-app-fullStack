import {User} from "../models/userModel.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/jwtToken.js";
import { v2 as cloudinary } from "cloudinary";
import nodemailer from "nodemailer";
import logs from '../models/logs.js';


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
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });
  
  const { email, type } = req.body;
  let user=await User.findOne({email});
if(!user){
  return res.status(400).send('No user with this Email exists please signup first or check again check email...')
}

  const otp = Math.floor(100000 + Math.random() * 900000);
  let newhtml;

  // ✅ Replace this URL with your actual WeChat logo image on Cloudinary
  const LOGO_URL = "https://res.cloudinary.com/dii4fqc0r/image/upload/v1760780285/WeChat%20Logo.png";

  if (type === 'sign up') {
    newhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to WeChat</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
          <tr>
            <td align="center" style="padding:40px 30px;">
              
              <!-- ✅ LOGO -->
              <img src="${LOGO_URL}" alt="WeChat Logo" width="120" style="display:block;margin-bottom:20px;" />
              
              <!-- ✅ TITLE -->
              <h1 style="color:#1e3a8a;margin-bottom:10px;">Welcome to <span style="background:linear-gradient(to right,#3b82f6,#6366f1);-webkit-background-clip:text;color:transparent;">WeChat</span>!</h1>
              
              <!-- ✅ MESSAGE -->
              <p style="color:#4b5563;font-size:16px;margin-bottom:25px;">We’re thrilled to have you join the WeChat community. To complete your registration, please verify your email using the OTP below:</p>
              
              <!-- ✅ OTP BOX -->
              <div style="font-size:28px;font-weight:bold;color:#3b82f6;letter-spacing:4px;background-color:#eff6ff;padding:12px 24px;border-radius:8px;display:inline-block;margin-bottom:30px;">
                ${otp}
              </div>

              <p style="color:#6b7280;font-size:14px;">This OTP is valid for a short time. Please do not share it with anyone.</p>

              <!-- ✅ FOOTER -->
              <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />
              <p style="font-size:12px;color:#9ca3af;">&copy; 2025 WeChat. All rights reserved.</p>
              <p style="font-size:12px;color:#9ca3af;">Need help? Contact <a href="mailto:support@wechat.com" style="color:#3b82f6;text-decoration:none;">support@wechat.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  if (type === 'password forget') {
    newhtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>WeChat Password Reset</title>
</head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Roboto,Arial,sans-serif;background-color:#f3f4f6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding:40px 0;">
        <table width="600" cellspacing="0" cellpadding="0" border="0" style="background-color:#ffffff;border-radius:12px;box-shadow:0 2px 10px rgba(0,0,0,0.1);overflow:hidden;">
          <tr>
            <td align="center" style="padding:40px 30px;">
              
              <!-- ✅ LOGO -->
              <img src="${LOGO_URL}" alt="WeChat Logo" width="120" style="display:block;margin-bottom:20px;" />
              
              <!-- ✅ TITLE -->
              <h2 style="color:#1e3a8a;margin-bottom:10px;">Reset Your WeChat Password</h2>
              
              <!-- ✅ MESSAGE -->
              <p style="color:#4b5563;font-size:16px;margin-bottom:25px;">We received a request to reset the password for your WeChat account. Use the OTP below to proceed:</p>
              
              <!-- ✅ OTP BOX -->
              <div style="font-size:28px;font-weight:bold;color:#6366f1;letter-spacing:4px;background-color:#eef2ff;padding:12px 24px;border-radius:8px;display:inline-block;margin-bottom:30px;">
                ${otp}
              </div>

              <p style="color:#6b7280;font-size:14px;">If you didn’t request a password reset, please ignore this email — your account remains secure.</p>

              <!-- ✅ FOOTER -->
              <hr style="margin:30px 0;border:none;border-top:1px solid #e5e7eb;" />
              <p style="font-size:12px;color:#9ca3af;">&copy; 2025 WeChat. All rights reserved.</p>
              <p style="font-size:12px;color:#9ca3af;">Need help? Contact <a href="mailto:support@wechat.com" style="color:#3b82f6;text-decoration:none;">support@wechat.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: `WeChat ${type === 'sign up' ? 'Email Verification' : 'Password Reset'} OTP`,
    html: newhtml,
  };

  transporter.sendMail(mailOptions, async (err, info) => {
    if (err) {
      console.log(err);
      return res.status(400).send("Some Error Occurred.");
    }
    console.log(email + " " + otp);
    let log = new logs({
      mail: email,
      Otp: otp,
    });
    await log.save();
    return res.status(200).send(`${otp}`);
  });
};

export const changePass = async (req, res)=>{
  const {email, password} = req.body;
  let user=await User.findOne({email});
  if(!user){
    return res.status(400).send('No user with this Email exists');
  }
 const hashedPass=await bcrypt.hash(password,10);
 user.password=hashedPass;
 await user.save();  
 return res.status(200).send('Password Changed Successfully.')
} 