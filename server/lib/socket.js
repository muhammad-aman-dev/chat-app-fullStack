import { Server } from "socket.io";

const userSocketMap={};

let io;

export function initSocket(server){
    io=new Server(server,{
        cors : {
            origin : process.env.FRONTEND_URL,
        }}
    )

io.on("connection", (socket)=>{
    
    const userID = socket.handshake.query.userID;
    console.log("User Connected to the server",socket.id," And Database ID ",userID);
    
    if(userID) userSocketMap[userID]=socket.id;


    io.emit("getOnlineUsers", Object.keys(userSocketMap))
   
    socket.on("disconnect", ()=>{
        console.log("User Disconnected",socket.id);

        delete userSocketMap[userID];
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    });
})

}

export function getRecieverSocketId(userID){
    return userSocketMap[userID]
}

export {io};