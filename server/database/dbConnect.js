import mongoose from "mongoose";

export const dbConnection= ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName: "TEST_MERN_STACK_CHAT_APP"
    }).then(()=>{
        console.log("Connected to Database")
    }).catch((err)=>{
        console.log(`Error Connecting to Database ${err}`)
    });
};
