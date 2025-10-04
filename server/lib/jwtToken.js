import jwt from "jsonwebtoken";

export const generateToken= async (user, message, statusCode, res)=>{
    const token=jwt.sign({id: user._id}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRE
    });

    return res.status(statusCode).cookie("usertoken", token, {
        httpOnly : true,
        maxAge : Number(process.env.COOKIE_EXPIRE) * 24 * 60 * 60 * 1000,
        sameSite : "strict",
        secure : process.env.CURR_STATUS !== "development" ? true : false,
    }).json({
        success : true,
        message,
        token
    });
}