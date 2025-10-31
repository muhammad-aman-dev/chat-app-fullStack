import { useSelector, useDispatch } from "react-redux"
import { useState , useEffect, useRef } from "react"
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { setIsUpdatingProfile } from "../store/slices/authslice";

const UpdatingProfile = () => {
  const { authUser} = useSelector((state)=>state.auth);
  const [fullName, setfullName] = useState('');
  const [avatar, setavatar] = useState('');
  const [updatedFullName, setupdatedFullName] = useState('');
  const [updatedDp , setUpdatedDp] = useState();
  const [updatedDpPreReview, setupdatedDpPreReview] = useState()
  const [isUpdating, setisUpdating] = useState(false)
  const dispatch = useDispatch();

  const fileRef = useRef(null);


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
    setisUpdating(true);
    if(updatedFullName==fullName && !updatedDp){
      toast.error('You did`nt maked any changes! ')
      setisUpdating(false);
      return
    }
    let data=new FormData();
    if(updatedFullName!=fullName){
    data.append("fullName", updatedFullName);
  }
  if(updatedDp){
    data.append("avatar", updatedDp);
  }
  if(updatedFullName!=fullName && updatedDp){
    data.append("avatar", updatedDp);
    data.append("fullName", updatedFullName);
  }
  try{
    let res=await axiosInstance.put('user/updateprofile', data);    
    toast(res.data.message);
}
  catch(err){
    toast('Some Error Occured...');
    console.log(err)
  }
  setisUpdating(false);
}


    return (
    <div className="w-full min-h-full gap-3 bg-white flex flex-col items-center justify-center relative">
      <div onClick={()=>{dispatch(setIsUpdatingProfile(false))}} className="cursor-pointer back absolute top-4 left-4 text-lg bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent">{'<Back To Chats'}</div>
        <div className="w-[200px] sm:w-[300px] relative">
          <input
          ref={fileRef}
          type="file"
          name="file"
          id="file"
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith("image/")) {
              setUpdatedDp(file);
              const reader = new FileReader();
              reader.onloadend = () => {
                setupdatedDpPreReview(reader.result); 
              };
              reader.readAsDataURL(file);
            }
          }}
        />
      <img src={updatedDpPreReview || avatar || "/defaultDp.png"} className="rounded-full w-[200px] h-[200px] sm:h-[300px] sm:w-[300px] border-1 border-gray-700" alt="User DP" />
      <img src="/edit.svg" alt="edit svg" onClick={()=>{fileRef.current.click()}} className="border-1 rounded-full w-8 p-1 border-black cursor-pointer bg-white absolute bottom-1 left-[44%]"/>
    </div>
    <input type="text" value={updatedFullName} onChange={(e)=>{setupdatedFullName(e.target.value)}} className="fullName text-gray-700 outline-1 rounded-2xl p-4" />
    <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={`px-5 py-2 rounded-xl font-semibold text-white ${( fullName==updatedFullName && !updatedDp )?'bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300':'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500'} shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300`}
              >
                {isUpdating?"Updating....":"Update"}
              </button>
    </div>
  )
}

export default UpdatingProfile
