import { useSelector, useDispatch } from "react-redux";
import { Loader2, MessageSquareText, Plus, SendIcon } from "lucide-react";
import { useState } from "react";
import { setsendMessage, setChatedUsers } from "../store/slices/chatslice";

const ChatArea = () => {
  const { isLoadingChat, selectedChat, chatWithUser, chatedUsers} = useSelector((state) => state.chat);
  const { onlineUsers, authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [inputText, setinputText] = useState('');

  function sendMessage(){
    const data={
      id : selectedChat._id,
      data : {
        text : inputText
      }
    }
    const exists = chatedUsers.some(chat => chat.userId === selectedChat._id);
    if (!exists) {
    dispatch(setChatedUsers(selectedChat));
    }
    console.log(data);
     dispatch(setsendMessage(data));
     setinputText('');
  }

  return (
    <div className="flex flex-col w-full h-full">
      {!chatWithUser && !isLoadingChat && (
        <div className="flex flex-col items-center justify-center h-full gap-9">
          <div className="flex items-center">
            <MessageSquareText color="#3B82F6" size={48} />
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1">
              WeChat
            </h2>
          </div>
          <h3 className="text-gray-700 text-lg sm:text-2xl text-center">
            Welcome to WeChat! Please select or start a new chat to enjoy the experience.
          </h3>
        </div>
      )}

      {isLoadingChat && (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
          <p className="font-semibold text-lg text-gray-700">Loading your Chats...</p>
        </div>
      )}

      {chatWithUser && (
        <div className="flex flex-col w-full min-h-[83%] max-h-[83%] gap-2 pb-2">
          <div className="chatHead rounded-md h-[80px] p-2 flex justify-between items-center sm:px-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="flex items-center gap-5">
              <img
                className="rounded-full w-14 h-14 object-cover"
                src={selectedChat?.avatar?.url || "/defaultDp.png"}
                alt=""
              />
              <div className="flex flex-col gap-2">
              <h5 className="text-white font-bold">{selectedChat?.fullName}</h5>
              <h5 className="text-white text-xs">{selectedChat?.email}</h5>
              </div>
            </div>
            <div className="isonline">
              <p className="text-white font-bold text-lg sm:text-xl">
                {onlineUsers.includes(selectedChat?._id) ? "🟢 Online" : "🔴 Offline"}
              </p>
            </div>
          </div>

          <div className="chat-section justify-end flex flex-col gap-2 w-full max-h-[calc(100%-50px)] min-h-[calc(100%-25px)] bg-gray-50">
          <div className="overflow-y-auto flex flex-col gap-2 w-full">
          {chatWithUser.map((message,index)=>{
            const isSender = message.sender === authUser._id;
            return (
              <div
          key={index}
          className={`flex w-full ${isSender ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-[70%] px-4 py-2 rounded-2xl shadow-md break-words ${
              isSender
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-none"
                : "bg-gray-200 text-gray-800 rounded-tl-none"
            }`}
          >
            {message.media ? (
              <img
                src={message.media}
                alt="media"
                className="rounded-lg max-w-xs"
              />
            ) : (
              <p className="text-sm sm:text-base">{message.text}</p>
            )}
            <p className={`text-[10px] mt-1 opacity-70 ${isSender ? "text-right" : "text-left"}`}>
              {new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        )
          })}
          </div>
          </div>

          <div className="input min-h-[50px] bg-white border-t rounded-2xl border-gray-200 flex items-center gap-3 justify-between px-2 py-3 sm:px-4">
           <Plus
          color="#000000"
          size={22}
          className="hover:scale-110 transition-transform duration-200 cursor-pointer"
        />
        <input className="w-full border-1 p-1 rounded-2xl border-gray-200" placeholder="Type Your Message" type="text" value={inputText} onChange={(e)=>{setinputText(e.target.value)}}/>
        <img src="/cross.svg" alt="clear input" onClick={()=>{setinputText('')}} className={inputText.length>0?'block':'invisible'}/>
          <SendIcon
          color="#000000"
          size={22}
          onClick={sendMessage}
          className={`hover:scale-110 transition-transform duration-200 cursor-pointer ${inputText.length>0?'block':'hidden'}`}
        />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
