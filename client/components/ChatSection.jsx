import ChatList from "./ChatList"
import ChatArea from "./ChatArea"

const ChatSection = () => {
  return (
    <div className="bg-gray-200/85 min-h-[calc(100vh-100px)] max-h-[calc(100vh-100px)] sm:min-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-100px)] flex mt-5 rounded-3xl p-3 w-full">
      <ChatList/>
      <div className="hidden md:block min-h-full w-[10px] bg-gray-200"></div>
      <div className="hidden md:block w-full">
      <ChatArea/>
      </div>
    </div>
  )
}

export default ChatSection
