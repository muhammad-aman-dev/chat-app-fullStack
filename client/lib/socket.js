import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userID)=>{

    if(socket) return socket;

    socket = io(import.meta.env.VITE_BACKEND_URL,
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