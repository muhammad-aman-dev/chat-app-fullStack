import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();

dotenv.config();

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
        useTempFiles:true,
        tempFileDir: "./temp/"
    })
)


console.log(process.env.PORT);


export default app;