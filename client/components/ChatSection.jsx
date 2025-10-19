import ChatList from "./ChatList"

const ChatSection = () => {
  return (
    <div className="bg-gray-200/85 min-h-[calc(100vh-270px)] max-h-[calc(100vh-270px)] sm:min-h-[calc(100vh-100px)] sm:max-h-[calc(100vh-100px)] flex mt-5 rounded-3xl p-3 w-full">
      <ChatList/>
      <div className="min-h-full w-[4px] bg-gray-200"></div>
    </div>
  )
}

export default ChatSection
