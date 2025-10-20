import { useSelector , useDispatch } from "react-redux"
import { Loader2, MessageSquareText } from "lucide-react";

const ChatArea = () => {
    const { isLoadingChat, selectedChat, chatWithUser }=useSelector((state)=>state.chat);

  return (
    <div className="flex flex-col w-full">
       {(!chatWithUser && !isLoadingChat) && <div className="flex flex-col items-center justify-center h-[100vh] gap-9">
        <div className='flex items-center'>
          <MessageSquareText color='#3B82F6' /> 
          <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1'>
            WeChat
          </h2>
        </div>
        <h3 className="text-gray-700 text-lg sm:text-2xl ">
        Welcome to WeChat Please Select Chat or Add New Chat to get Amazing experience of chatting.
        </h3>
        </div>
       } 
      {isLoadingChat && <div className="flex flex-col items-center justify-center h-[100vh] ">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
        <p className="font-semibold text-lg text-gray-700">Loading your Chats...</p>
      </div>}
      {chatWithUser!=null && <div className="flex-col w-full h-full">
        <div className="chatHead rounded-md h-[80px] p-2 flex justify-between bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
            <div className="flex items-center gap-5">
              <img className="rounded-full w-14" src={selectedChat.avatar.url ? selectedChat.avatar.url : '/defaultDp.png'} alt="" />
              <h5 className="text-white font-bold">{selectedChat.fullName}</h5>
            </div>
        </div> 
      </div>

      }
    </div>
  )
}

export default ChatArea
