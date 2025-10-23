import { useSelector, useDispatch } from "react-redux"
import { useState , useEffect } from "react"
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";

const UpdatingProfile = () => {
  const { isUpdatingProfile , authUser} = useSelector((state)=>state.auth);
  const [fullName, setfullName] = useState('');
  const [avatar, setavatar] = useState('');
  const [updatedFullName, setupdatedFullName] = useState('');
  const [updatedDp , setUpdatedDp] = useState();

  useEffect(() => {
    setfullName(authUser.fullName);
    setupdatedFullName(authUser.fullName);
    if(authUser.avatar.url && authUser.avatar.url===''){
    setavatar('/defaultDp.png');
    }
    if(authUser.avatar.url && authUser.avatar.url!=''){
        setavatar(authUser.avatar.url)
    }
    
  }, [])
  
  async function handleUpdate(){
    if(updatedFullName==fullName && !updatedDp){
      toast.error('You did`nt maked any changes! ')
      return
    }
    let data;
    if(updatedFullName!=fullName){
    data={
     fullName : updatedFullName,
    }
}
  if(updatedDp){
  data={
    avatar : updatedDp,
  }
  }
  if(updatedFullName!=fullName && updatedDp){
    data={
    fullName : updatedFullName,
    avatar : updatedDp,
    }
  }
  try{
    let res=await axiosInstance.put('user/updateprofile', data);    
    toast(res.data.message);
}
  catch(err){
    toast('Some Error Occured...');
    console.log(err)
  }
}

    return (
    <div className="w-full min-h-full gap-3 bg-white flex flex-col items-center justify-center">
        <div className="w-[200px] sm:w-[300px] ">
      <img src={avatar?avatar:'defaultDp.png'} className="rounded-full w-[200px] sm:w-[300px] border-1 border-gray-700" alt="User DP" />
    </div>
    <input type="text" value={updatedFullName} onChange={(e)=>{setupdatedFullName(e.target.value)}} className="fullName text-gray-700 outline-1 rounded-2xl p-4" />
    <button
                onClick={handleUpdate}
                className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300"
              >
                Update
              </button>
    </div>
  )
}

export default UpdatingProfile
