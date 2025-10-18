import mongoose from "mongoose";

const logs=new mongoose.Schema({
    mail:{
        type:String,
        required:[true,'email is required']
    },
    Otp:{
        type:String,
        required:[true,'OTP is required']
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 21600  //6 Hours 
      }
})

export default mongoose.model("Logs",logs)