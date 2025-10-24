import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbConnection } from "./database/dbConnect.js";
import userRouter from "./routes/userRoute.js"
import messageRouter from "./routes/messageRouter.js"

const app = express();

dotenv.config();

dbConnection();

app.use(
    cors({
        origin:[process.env.FRONTEND_URL],
        credentials:true,
        methods:["GET","POST","PUT","DELETE"]
    })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
    parseNested: true,     
    preserveExtension: true,  
  })
);

app.get("/",async (req,res)=>{
    return res.send("Hello")
})

app.use("/api/user",userRouter)
app.use("/api/message",messageRouter)


export default app;