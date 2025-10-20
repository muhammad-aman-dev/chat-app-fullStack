import { Plus } from "lucide-react"
import { useSelector, useDispatch } from "react-redux"
import { axiosInstance } from "../lib/axios";
import { useEffect } from "react";
import { setallUsers } from "../store/slices/chatslice";
import { getChatedusers } from "../store/slices/chatslice";
import { setSelectedUser } from "../store/slices/chatslice";


const ChatList = () => {
    const { onlineUsers, authUser } = useSelector((state)=>state.auth);
    const { isLoadingChatList, allUsers, chatedUsers, selectedChat }=useSelector((state)=>state.chat);
    const dispatch = useDispatch();

    const getAllUsers = async ()=>{
        try{
        const res = await axiosInstance.get('message/allusers');
        dispatch(setallUsers(res.data.users));
        console.log(res.data.users);
        return res.data.users;
        }
        catch(err){
            console.log(err)
        }
    }

    function setUser(user) {
      dispatch(setSelectedUser(user));
    }


    useEffect(() => {
      getAllUsers();
      dispatch(getChatedusers(authUser._id))
    }, [])
    

  return (
    <div className="w-full sm:w-[24%] flex flex-col text-blue-600">
        <div className="flex items-center gap-4 p-3">
            <input type="text" placeholder="Search Chat" className="font-bold px-3 outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-1 rounded-2xl shadow-blue-300"/>
            <Plus color="#5856d6" className="hover:scale-105 duration-300 cursor-pointer"/>
        </div>
        <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold sm:text-xl">Chats</h3>
        <p className="mr-2">Online Users[{onlineUsers.length-1}]</p>
        </div>
        <div className="chats flex flex-col gap-1 h-full w-full overflow-y-auto custom-scrollbar">
           {chatedUsers.map((chat, index)=>{
            const user = allUsers.find((u) => u._id === chat.userId);
            if (!user) return null;

            const isOnline = onlineUsers.includes(user._id);

            return <div key={index} onClick={()=>{setUser(user)}} className="chat flex h-[70px] p-1 items-center gap-2 hover:bg-gray-100 duration-300">
            <img src={user.avatar.url!='' ? user.avatar.url : '/defaultDp.png'} alt="DP" className="w-12 h-12 rounded-full"/>
            <div className="Name font-bold">{user.fullName}</div>
            <div className={`isOnline ml-5 rounded-full w-4 h-4 ${isOnline?'bg-green-400':'bg-red-400'}`}></div>
          </div>
           })
}
        </div>
    </div>
  )
}

export default ChatList
