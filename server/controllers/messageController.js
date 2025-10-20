import { User } from "../models/userModel.js";
import { Message } from "../models/messageModel.js"
import { v2 as cloudinary } from "cloudinary";
import { getRecieverSocketId } from "../lib/socket.js";
import mongoose from "mongoose";

export const getAllUsers= async(req, res, next)=>{
    const user=req.user;
    const filteredUsers= await User.find({_id:{ $ne : user }}).select("-password");
    res.status(200).json({
        success : true,
        users : filteredUsers
    })
}

export const getMessages= async(req, res, next)=>{
 const recieverID = req.params.id;
 const myID = req.user._id;
 const reciever= await User.findOne({_id:recieverID});
 if(!reciever){
    return res.status(400).json({
        success : false,
        message : "No Reciever Found with This ID..."
    })
 }
 const messages = await Message.find({
    $or :[
        {sender : myID, reciever : recieverID},
        {sender : recieverID, reciever : myID}
    ]
 }).sort({createdAt : 1});

 res.status(200).json({
    success : true,
    messages
 });
}

export const sendMessage= async(req, res, next)=>{
   const {text}=req.body;
   const media=req?.files?.media;
   const recieverID=req.params.id;
   const senderID=req.user._id;
   const reciever= await User.findOne({_id:recieverID});
   if(!reciever){
    return res.status(400).json({
        success : false,
        message : "No Reciever Found with This ID..."
    })
 }
 const filteredText = text?.trim() || "";
 
 if(!filteredText && !media){
    return res.status(400).json({
        success : false ,
        message : "Cannot Send Empty Message..."
    })
 }

 let mediaUrl = "";

 if(media){
    try{
        const uploadResponse = await cloudinary.uploader.upload(media.tempFilePath, {
        resource_type : "auto",
        folder : "CHAT_APP_MEDIA",
        transformation : [
            {width : 1080 , height : 1080 , crop : "limit"},
            {quality : "auto"},
            {fetch_format : "auto"},
        ]
    })
    mediaUrl= uploadResponse?.secure_url;
    }
    catch(err){
        console.error("Cloudinary Upload Error: ",err);
        return res.status(500).json({
            success: false,
            message: "Failed to Upload Avatar..."
        });
        }
 }

 const newMessage = await Message.create({
    senderID,
    recieverID,
    text: filteredText,
    media: mediaUrl,
 });

 const recieverSocketId = getRecieverSocketId(recieverID);
 if(recieverSocketId){
    io.to(recieverSocketId).emit("newMessage", newMessage)
 }

res.status(200).json(newMessage);

}

export const getChatUsers = async (req, res) => {
  try {
    const userId = req.params.userId; // keep as string

    const users = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: userId },
            { reciever: userId }
          ]
        }
      },
      { $sort: { updatedAt: -1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$sender", userId] },
              "$reciever",
              "$sender"
            ]
          },
          lastMessage: { $first: "$text" },
          lastMedia: { $first: "$media" },
          lastMessageTime: { $first: "$updatedAt" }
        }
      },
      { $sort: { lastMessageTime: -1 } },
      // optional lookup (only if your user collection uses string _id too)
      {
        $lookup: {
          from: "users", // or "user" depending on your actual collection name
          localField: "_id",
          foreignField: "_id", // only works if user._id is also a string
          as: "userInfo"
        }
      },
      { $unwind: { path: "$userInfo", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          username: "$userInfo.username",
          avatar: "$userInfo.avatar",
          lastMessage: 1,
          lastMedia: 1,
          lastMessageTime: 1
        }
      }
    ]);

    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
