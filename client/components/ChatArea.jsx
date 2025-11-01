import { useSelector, useDispatch } from "react-redux";
import { Loader2, MessageSquareText, Plus, SendIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  setsendMessage,
  setLatestMessage,
  setselectedChat,
} from "../store/slices/chatslice";
import { setIsUpdatingProfile } from "../store/slices/authslice";
import { X } from "lucide-react";

const ChatArea = () => {
  const { isLoadingChat, selectedChat, chatWithUser } = useSelector(
    (state) => state.chat
  );
  const { onlineUsers, authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [inputText, setinputText] = useState("");
  const [photoSelected, setphotoSelected] = useState(null);
  const [photoPreview, setphotoPreview] = useState();

  function handleisUpdatingProfile(e) {
    e.stopPropagation();
    dispatch(setIsUpdatingProfile(true));
  }

  const bottomRef = useRef(null);
  const photoRef = useRef(null);

  function sendMessage() {
    let data = new FormData();
    if (inputText.length > 0) {
      data.append("text", inputText);
    }
    if (photoSelected != null) {
      data.append("media", photoSelected);
    }
    dispatch(setLatestMessage({ userId: selectedChat._id }));
    dispatch(setsendMessage({ id: selectedChat._id, data }));
    setinputText("");
    setphotoSelected(null);
    setphotoPreview();
  }

  //      document.addEventListener('keydown',(event)=>{
  //       if(event.key == 'Enter' && (inputText.length>0 || photoSelected!=null)){
  //         console.log('Enter')
  //         sendMessage();
  //       }
  // })

  function handleBack() {
    dispatch(setselectedChat(null));
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [chatWithUser]);

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
            Welcome to WeChat! Please select or start a new chat to enjoy the
            experience.
          </h3>
          <span
            onClick={(e) => {
              handleisUpdatingProfile(e);
            }}
            className="cursor-pointer border-b-1 border-purple-500 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent"
          >
            Update Profile
          </span>
        </div>
      )}

      {isLoadingChat && (
        <div className="flex flex-col items-center justify-center h-full">
          <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
          <p className="font-semibold text-lg text-gray-700">
            Loading your Chats...
          </p>
        </div>
      )}

      {chatWithUser && selectedChat && (
        <div className="flex flex-col w-full min-h-[83%] max-h-[83%] gap-2 pb-2">
          <div className="chatHead rounded-md h-[80px] p-2 flex justify-between items-center sm:px-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="flex items-center gap-5">
              <div className="flex gap-1 items-center">
                <img
                  src="/back.svg"
                  alt="back"
                  className={`block sm:hidden`}
                  onClick={handleBack}
                />
                <img
                  className="rounded-full w-14 h-14 object-cover"
                  src={selectedChat?.avatar?.url || "/defaultDp.png"}
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-2">
                <h5 className="text-white font-bold">
                  {selectedChat?.fullName}
                </h5>
                <h5 className="text-white text-xs">{selectedChat?.email}</h5>
              </div>
            </div>
            <div className="isonline">
              <p className="text-white font-bold text-xs sm:text-xl">
                {onlineUsers.includes(selectedChat?._id)
                  ? "🟢 Online"
                  : "🔴 Offline"}
              </p>
            </div>
          </div>

          <div className="chat-section justify-end flex flex-col gap-2 w-full max-h-[calc(100%-50px)] sm:min-h-[calc(100%)] bg-gray-50">
            <div className="overflow-y-auto flex flex-col gap-2 w-full">
              {chatWithUser.map((message, index) => {
                const isSender = message.sender === authUser._id;
                return (
                  <div
                    key={index}
                    className={`flex w-full ${
                      isSender ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[60%] px-4 py-2 rounded-2xl shadow-md break-words ${
                        isSender
                          ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tr-none"
                          : "bg-gray-200 text-gray-800 rounded-tl-none"
                      }`}
                    >
                      {message.media ? (
                        <>
                        <img
                          src={message.media}
                          alt="media"
                          className="rounded-lg max-w-[350] min-w-full max-h-[300px] object-contain"
                        />
                        {message.text && <p className="text-sm sm:text-base max-w-[250px] sm:max-w-[350px]">{message?.text}</p>}
                        </>
                      ) : (
                        <p className="text-sm sm:text-base max-w-[250px] sm:max-w-[350px]">{message?.text}</p>
                      )}
                      <p
                        className={`text-[10px] mt-1 opacity-70 ${
                          isSender ? "text-right" : "text-left"
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef}></div>
            </div>
          </div>

          <div className="input min-h-[50px] bg-white border-t rounded-2xl border-gray-200 flex items-center gap-3 justify-between px-2 py-3 sm:px-4 relative">
            <div
              className={`photoforsend ${
                photoPreview ? "block" : "hidden"
              }  absolute min-w-52 overflow-hidden min-h-52 max-w-52 max-h-52 bg-gray-200 -top-44 sm:-top-66 px-3 pt-2 pr-5 left-0 sm:min-w-66 sm:min-h-66 sm:max-w-66 sm:max-h-66`}
            >
              <img
                src={photoPreview ? photoPreview : "/defaultDp.png"}
                className="w-full h-full border-1  object-fill  max-w-46 max-h-46  sm:max-w-62 sm:max-h-62 border-black"
                alt="User DP"
              />
              <div className=" bg-black border-1 absolute top-0 z-100 right-2 rounded-md">
                <img
                  src="cross.svg"
                  alt="cancel"
                  className=" hover:scale-110 duration-300 cursor-pointer invert-100 "
                  onClick={(e) => {
                    setphotoPreview(null);
                  }}
                />
              </div>
            </div>
            <input
              ref={photoRef}
              type="file"
              name="file"
              id="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file && file.type.startsWith("image/")) {
                  setphotoSelected(file);
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setphotoPreview(reader.result);
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <Plus
              color="#000000"
              onClick={(e) => {
                e.stopPropagation();
                photoRef.current.click();
              }}
              size={22}
              className="hover:scale-110 transition-transform duration-200 cursor-pointer"
            />
            <input
              className="w-full border-1 p-1 rounded-2xl border-gray-200"
              placeholder="Type Your Message"
              type="text"
              value={inputText}
              onChange={(e) => {
                setinputText(e.target.value);
              }}
            />
            <img
              src="/cross.svg"
              alt="clear input"
              onClick={() => {
                setinputText("");
              }}
              className={inputText.length > 0 ? "block" : "invisible"}
            />
            <SendIcon
              color="#000000"
              size={22}
              onClick={sendMessage}
              className={`hover:scale-110 transition-transform duration-200 cursor-pointer ${
                inputText.length > 0 || photoSelected != null
                  ? "block"
                  : "hidden"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
