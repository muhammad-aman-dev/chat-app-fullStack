import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { axiosInstance } from "../lib/axios";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedUser, setChoosingNew } from "../store/slices/chatslice";

const NewChatSelect = () => {
    const [searchInput, setsearchInput] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [users, setusers] = useState([])
    const { onlineUsers, authUser }=useSelector((state)=>state.auth)

    const dispatch = useDispatch();

    async function searchUsers(){
        setisLoading(true);
        if(searchInput!=''){
            let res =await axiosInstance.post('user/search',{ input : searchInput });
            console.log(res.data.users)
            setusers(res.data.users);
            setisLoading(false)
            return
        }
        else{
            setisLoading(false)
            return
        }
    }

    useEffect(() => {
      searchUsers();
    }, [searchInput])
    

    const setUser = (user) => {
        dispatch(setSelectedUser(user));
        dispatch(setChoosingNew(false));
      };

  return (
    <div className="flex  flex-col w-[98%] text-gray-700 h-[96%] items-center bg-gray-400/75 justify-center m-0">
      <div className="bg-white flex flex-col items-center w-[80%] relative">
        <img src="/cross.svg" alt="Close" className="absolute right-3 top-3 hover:scale-105 duration-300 cursor-pointer" onClick={()=>{dispatch(setChoosingNew(false))}}/>
        <h3 className="text-lg text-center p-3 font-bold">Search User</h3>
        <input type="text" value={searchInput} onChange={(e)=>{setsearchInput(e.target.value)}} className="border-1 w-[90%] sm:w-[80%] rounded-2xl p-1 border-gray-700" placeholder="Search with Email"/>
        <div className="Users flex flex-col gap-2 max-h-[300px] min-h-[300px] w-full sm:w-[80%]">
           <h4 className="font-bold mt-3 text-center">Users</h4>
            {isLoading && <div className="w-max flex flex-col"><div className="animate-spin border-r-4 border-l-4 rounded-full text-blue-600 w-10 h-10"></div></div>}
            <div className="flex flex-col gap-4 overflow-y-auto">
            {users.map((user, index)=>{
                const isOnline = onlineUsers.includes(user._id);
                const isMe = user.email === authUser.email;
                if(isMe){
                  return null;
                }
                return <div
              key={index}
              onClick={() => setUser(user)}
              className={`chat flex h-[70px] p-1 items-center gap-2 rounded-md cursor-pointer transition-all duration-200 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white`}
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
              <div className="flex flex-col gap-2 justify-center">
              <div className="Name font-bold truncate">{user.fullName}</div>
              <div className="Name text-xs truncate">{user.email}</div>
              </div>
            </div>
            })}
            </div>
        </div>
      </div>
    </div>
  )
}

export default NewChatSelect
