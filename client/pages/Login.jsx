import { useState } from "react"
import { MessageSquareText } from "lucide-react"
import { Link } from "react-router-dom"
import { toast } from "react-toastify";
import { axiosInstance } from "../lib/axios";
import { login } from "../store/slices/authslice";
import { useDispatch } from "react-redux";

const Login = () => {
   const [togglePass, settogglePass] = useState('password');
   const [forgotPass, setforgotPass] = useState(false);
   const [isVerified, setisVerified] = useState(false);
   const [emailtoVerify, setemailtoVerify] = useState('');
   const [otp, setotp] = useState('');
   const [enteredOTP, setenteredOTP] = useState('');
   const [newPass, setnewPass] = useState('');
   const [confirmPass, setconfirmPass] = useState('');
   const [isReqSent, setisReqSent] = useState(false);
   const [email, setemail] = useState('');
   const [password, setpassword] = useState('');

  const dispatch=useDispatch();

   function handleBack() {
    settogglePass('password');
    setforgotPass(false);
    setisVerified(false);
    setemailtoVerify('');
    setotp('');
    setenteredOTP('');
    setnewPass('');
    setisReqSent(false);
    setconfirmPass('');
   }

   function handleLogin() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
     toast.error('Email Format Mismatched...')
     return
    }
     if(email!='' && password!=''){
      const data={
        email,
        password
      }
     dispatch(login(data));
    }
    else{
      toast.error('Please Enter details...')
    }
   }

   async function handleChangePass() {
    setisReqSent(true);
    if(newPass.length<8||newPass==''){
      toast.error('Please Enter Minimum 8 Characters Password...')
      setisReqSent(false);
      return
    }
    if(newPass!=confirmPass){
      toast.error('New Password and Confirm Password Not Match...')
      setisReqSent(false);
      return
    }
    try{
    let res= await axiosInstance.post('user/changepass',{
      email : emailtoVerify,
      password : newPass
    })
    toast.success(res.data);
    }
    catch(error){
    console.log(error.response.data)
    toast.error(error.response.data)
    }
    settogglePass('password');
    setforgotPass(false);
    setisVerified(false);
    setemailtoVerify('');
    setotp('');
    setenteredOTP('');
    setnewPass('');
    setisReqSent(false);
    setconfirmPass('');
   }

   async function getOTP() {
    setisReqSent(true);
    try {
      let res = await axiosInstance.post('user/getotp', {
        email: emailtoVerify,
        type: 'password forget'
      })
      toast.success('Email sent please check now if you dont see it also check spam box!!!')
      setotp(`${res.data}`);
    } catch (error) {
      console.log(error)
      toast(error.response.data)
    }
    setisReqSent(false);
   }

   function handleVerify() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailPattern.test(emailtoVerify)){
     getOTP();
    }
    else{
      toast('Invalid Email Format!!!');
    }
   }

   function handleTogglePass() {
    (togglePass=='password')?settogglePass('text'):settogglePass('password');
   }

  return (
    <div className="flex flex-col gap-7 bg-gray-100/98 mt-7 p-10 relative">
      {forgotPass &&<button onClick={handleBack} className="text-blue-600  absolute font-bold cursor-pointer flex items-center">{'<'}back</button>}
      <div className="text-area flex flex-col items-center m-auto justify-center ">
        <div className='flex items-center justify-center'>
          <MessageSquareText color='#3B82F6'/>
          <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent'> WeChat </h2>
        </div>
        <p className="text-blue-600 sm:text-xl mt-3">Chat securely with your friends — simple, fast, and end-to-end encrypted.</p>
      </div>

      {!forgotPass && (
        <div className="form flex flex-col gap-8 items-center">
          <input type="email" onChange={(e)=>{setemail(e.target.value)}} value={email} placeholder="Enter Your Email" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <div className="w-full relative">
            <input type={togglePass} onChange={(e)=>{setpassword(e.target.value)}} value={password} placeholder="Enter Your Password" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
            <img className="absolute right-4 top-3 cursor-pointer" onClick={handleTogglePass} src={togglePass==='password'?'/eye.svg':'/eyeclosed.svg'} alt="Show Password" />
          </div>
          <button onClick={handleLogin} className="w-3/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300">Login</button>
          <div className="text-blue-600 flex flex-col items-center sm:flex-row sm:justify-between w-full">
            <button onClick={()=>{setforgotPass(true)}} className="cursor-pointer underline">Forgot Password?</button>
            <div><span>Not Registered?</span><Link to={'/signup'} className="underline ml-1">Sign Up Now</Link></div>
          </div>
        </div>
      )}

      {(forgotPass && !isVerified) && (
        <div className="flex flex-col items-center gap-4">
          <input type="email" placeholder="Enter Your Email" onChange={(e)=>{setemailtoVerify(e.target.value)}} value={emailtoVerify} className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <button disabled={isReqSent} onClick={handleVerify} className="verify w-3/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300">{isReqSent?'Requesting OTP...':'Get OTP'}</button>
          
          {(!isVerified && otp!='')&& 
          <div className="flex justify-between w-full gap-2">
            <input type="text" placeholder="Enter OTP" onChange={(e)=>{setenteredOTP(e.target.value)}} value={enteredOTP} className="sm:w-1/2 font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
            <button onClick={()=>{if(enteredOTP!='' && enteredOTP=== otp){
              setisVerified(true);
              toast.success('Verified')
            } else {
              toast('Wrong OTP Entered!!!')
            }}} className="verify w-1/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300">{isVerified?'Verified':'Verify'}</button>
          </div>
          }
        </div>
      )}

      {isVerified && (
        <div className="flex flex-col gap-4 items-center">
          <input type="password" onChange={(e)=>{setnewPass(e.target.value)}} value={newPass} placeholder="Enter Your New Password" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <input type="password" onChange={(e)=>{setconfirmPass(e.target.value)}} value={confirmPass} placeholder="Confirm Password" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <button disabled={isReqSent} onClick={handleChangePass} className="verify w-3/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300">{isReqSent?'Changing Password...':'Change Password'}</button>
        </div>
      )}
    </div>
  )
}

export default Login
