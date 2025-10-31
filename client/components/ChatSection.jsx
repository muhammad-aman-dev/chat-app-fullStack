import ChatList from "./ChatList"
import ChatArea from "./ChatArea"
import NewChatSelect from "./NewChatSelect"
import { useSelector } from "react-redux"
import UpdatingProfile from "./UpdatingProfile"

const ChatSection = () => {
  const { isChoosingNew , selectedChat }=useSelector((state)=>state.chat);
  const { isUpdatingProfile }=useSelector((state)=>state.auth);
  
  return (
    <div className="bg-gray-200/85 relative min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-100px)] flex mt-5 rounded-3xl p-3 w-full">
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
