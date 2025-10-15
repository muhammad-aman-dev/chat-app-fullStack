import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userID)=>{
    socket = io(import.meta.env.BACKEND_URL,
        {
            query : { userID },
        }
    )
    return socket;
};

export const getSocket = () => socket;

export const disConnectSocket = () =>{
    if(socket){
        socket.disconnect();
        socket = null;
    }
}