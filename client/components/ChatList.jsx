import { Plus, MessageSquareText } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllUsers,
  getChatedusers,
  setSelectedUser,
  setChoosingNew,
} from "../store/slices/chatslice";

const ChatList = () => {
  const { onlineUsers, authUser } = useSelector((state) => state.auth);
  const { isLoadingChatList, allUsers, chatedUsers, selectedChat } = useSelector(
    (state) => state.chat
  );
  const [searchChat, setsearchChat] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch all users and chat users when component mounts
    dispatch(getAllUsers());
    if (authUser?._id) {
      dispatch(getChatedusers(authUser._id));
    }
  }, [dispatch, authUser]);

  const setUser = (user) => {
    dispatch(setSelectedUser(user));
  };

  return (
    <div className="w-full sm:w-[30%] flex flex-col text-blue-600 bg-white border-r border-gray-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500">
        <div className="flex items-center gap-2">
          <MessageSquareText color="#fff" size={22} />
          <h2 className="text-white text-lg font-semibold">WeChat</h2>
        </div>
        <Plus
          color="#fff"
          size={22}
          className="hover:scale-110 transition-transform duration-200 cursor-pointer"
          onClick={() => dispatch(setChoosingNew(true))}
        />
      </div>

      <div className="flex items-center gap-4 p-3 relative">
        <input
          value={searchChat}
          onChange={(e)=>{setsearchChat(e.target.value)}}
          type="text"
          placeholder="Search Chat"
          className="font-bold w-full px-3 py-1 rounded-2xl text-blue-600 bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none placeholder:text-blue-400 shadow-sm"
        />
        <img src="/cross.svg" alt="clear search" onClick={()=>{setsearchChat('')}} className={`${searchChat!=''?'block':'hidden'} cursor-pointer hover:scale-105 duration-300 absolute right-5`} />
      </div>

      <div className="flex justify-between items-center px-3 pb-2 border-b border-gray-100">
        <h3 className="text-lg font-bold sm:text-xl text-blue-600">Chats</h3>
        <p className="mr-2 text-gray-600">
          Online Users[{onlineUsers?.length ? onlineUsers.length - 1 : 0}]
        </p>
      </div>

      <div className="chats flex flex-col gap-1 h-full w-full overflow-y-auto custom-scrollbar">
        {isLoadingChatList ? (
          <p className="text-center text-gray-400 p-4">Loading chats...</p>
        ) : chatedUsers.length === 0 ? (
          <p className="text-center text-gray-400 p-4">No chats yet</p>
        ) : (
          chatedUsers.map((chat, index) => {
            const user = allUsers.find((u) => u._id === chat.userId);
            if (!user) return null;
            const email = user.email;
            const fullName = user.fullName.toLowerCase();
            const isOnline = onlineUsers.includes(user._id);
            const isSelected = selectedChat?._id === user._id;

            if(searchChat!='' && !email.startsWith(searchChat) && !fullName.includes(searchChat.toLowerCase())){
           return null;
            }

            return (
              <div
                key={index}
                onClick={() => setUser(user)}
                className={`chat flex h-[70px] p-1 items-center gap-2 rounded-md cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="relative">
                  <img
                    src={user.avatar?.url || "/defaultDp.png"}
                    alt="DP"
                    className="w-12 h-12 rounded-full object-cover border border-gray-300"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${
                      isOnline ? "bg-green-400" : "bg-red-400"
                    }`}
                  ></span>
                </div>
                <div className="flex flex-col gap-1 justify-center">
                  <div className="font-bold truncate">{user.fullName}</div>
                  <div className="text-xs truncate">{user.email}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
