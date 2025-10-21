import { useSelector } from "react-redux";
import { Loader2, MessageSquareText } from "lucide-react";

const ChatArea = () => {
  const { isLoadingChat, selectedChat, chatWithUser } = useSelector((state) => state.chat);
  const { onlineUsers } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col w-full h-screen">
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
        <div className="flex flex-col w-full min-h-[83%] max-h-[83%]">
          <div className="chatHead rounded-md h-[80px] p-2 flex justify-between items-center sm:px-7 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="flex items-center gap-5">
              <img
                className="rounded-full w-14 h-14 object-cover"
                src={selectedChat.avatar?.url || "/defaultDp.png"}
                alt=""
              />
              <h5 className="text-white font-bold">{selectedChat.fullName}</h5>
            </div>
            <div className="isonline">
              <p className="text-white font-bold text-lg sm:text-xl">
                {onlineUsers.includes(selectedChat._id) ? "🟢 Online" : "🔴 Offline"}
              </p>
            </div>
          </div>

          <div className="chat-section flex-1 w-full max-h-[calc(100%-50px)] overflow-y-auto bg-gray-50">
            hg
          </div>

          <div className="input h-[50px] bg-white border-t border-gray-200 flex items-center justify-center">
            jjj
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
