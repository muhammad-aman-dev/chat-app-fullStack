import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import { dbConnection } from "./database/dbConnect.js";
import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRouter.js";

const app = express();
dotenv.config();

// ✅ Connect database
dbConnection();

// ✅ Enable CORS with correct settings
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. "https://chatappfrontend.vercel.app"
    credentials: true,                // allow sending/receiving cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// ✅ Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ File upload setup
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "./temp/",
    parseNested: true,
    preserveExtension: true,
  })
);

// ✅ Base route
app.get("/", (req, res) => {
  return res.send("Server is running ✅");
});

// ✅ Routes
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

export default app;
