import ChatList from "./ChatList";
import ChatArea from "./ChatArea";
import NewChatSelect from "./NewChatSelect";
import { useSelector } from "react-redux";
import UpdatingProfile from "./UpdatingProfile";
import { useEffect, useState } from "react";

const ChatSection = () => {
  const { isChoosingNew , selectedChat }=useSelector((state)=>state.chat);
  const { isUpdatingProfile }=useSelector((state)=>state.auth);
  const [showNotice, setShowNotice] = useState(false);

  
useEffect(() => {
  setShowNotice(true);
}, []);
  
  return (
    <div className="bg-gray-200/85 relative min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-100px)] flex mt-5 rounded-3xl p-3 w-full">
      {showNotice && (
  <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">

    <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-sm p-6 border border-gray-200">

      <h2 className="text-[20px] font-semibold text-gray-800 mb-2 text-center">
        ⚠️ Backend Notice
      </h2>

      <p className="text-gray-600 text-sm mb-5 leading-relaxed text-center">
        For some technical reasons, our backend (Socket.IO server) isn’t working 
        on the deployed version.  
        <br /><br />
        Please clone the repository and run it locally.  
        For help or more details, contact <b><a href={`${import.meta.env.VITE_PORTFOLIO_URL}`} className="text-blue-400 underline" target="_blank">Muhammad Aman</a></b>.
      </p>

      <button
        onClick={() => setShowNotice(false)}
        className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 
                   text-white rounded-xl shadow-md hover:shadow-lg 
                   hover:opacity-90 transition-all font-medium cursor-pointer"
      >
        Okay, Got It
      </button>

    </div>

  </div>
)}

      {!isUpdatingProfile && <> <div className={`chatlist ${selectedChat==null?'block':'hidden'} sm:block w-full sm:w-[30%] min-h-[100%]`}><ChatList/></div>
      <div className="hidden sm:block min-h-full w-[10px] bg-gray-200"></div>
      <div className={`${selectedChat?'block':'hidden'} sm:block w-full min-h-full max-h-full`}>
      <ChatArea/>
      </div>
      <div className={`${isChoosingNew?'block':'hidden'} absolute z-30 m-auto flex w-full h-full`}>
        <NewChatSelect />
      </div> 
      </>}
      {isUpdatingProfile &&  <UpdatingProfile/>}
    </div>
  )
}

export default ChatSection
