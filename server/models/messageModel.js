import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
    sender:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    reciever:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "user",
        required : true
    },
    text : String,
    media : String

},{timestamps:true});

export const Message = mongoose.model("Message", messageSchema);