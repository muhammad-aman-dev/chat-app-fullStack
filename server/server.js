import app from "./app.js";
import { v2 as cloudinary} from "cloudinary";
import http from "http"
import { initSocket } from "./lib/socket.js";

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDIBNARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

const server= http.createServer(app);
initSocket(server);

server.listen(process.env.PORT ,()=>{ 
    console.log(`SERVER IS RUNNING ON PORT ${process.env.PORT}`);
})