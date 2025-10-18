import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { signup } from '../store/slices/authslice';
import { toast } from 'react-toastify';

const Signup = () => {
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [fullName, setfullName] = useState('')
    const [togglePass, settogglePass] = useState('password');
 
    const { isSignUp } = useSelector((state)=> state.auth);
    const dispatch= useDispatch();


    function handleSignup(){
        if(email==='' || password==='' || fullName===''){
            toast.error('Please Provide All Details...')
            return
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailPattern.test(email)){
     toast.error('Email Format Mismatched...')
     return
    }
    if(password.length<8 || password.length>16){
        toast.error('Password Lenght Must be between 8 to 16 Characters')
        return
    }
    const data={
        email,
        password,
        fullName
    }
    dispatch(signup(data));
    }

    function handleTogglePass() {
    (togglePass=='password')?settogglePass('text'):settogglePass('password');
   }

  return (
    <div className="flex flex-col gap-7 bg-gray-100/98 mt-7 p-10 relative">
      <div className="text-area flex flex-col items-center m-auto justify-center ">
        <div className='flex items-center justify-center'>
          <MessageSquareText color='#3B82F6'/>
          <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent'> WeChat </h2>
        </div>
        <p className="text-blue-600 sm:text-xl mt-3">Sign Up now and chat with your friends.</p>
      </div>
     <div className="form flex flex-col gap-8 items-center">
          <input type="text" onChange={(e)=>{setfullName(e.target.value)}} value={fullName} placeholder="Enter Your Full Name" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <input type="email" onChange={(e)=>{setemail(e.target.value)}} value={email} placeholder="Enter Your Email" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
          <div className="w-full relative">
            <input type={togglePass} onChange={(e)=>{setpassword(e.target.value)}} value={password} placeholder="Enter Your Password" className="w-full font-bold outline-1 outline-blue-400 text-blue-600 focus:shadow-md p-3 rounded-2xl shadow-blue-300"/>
            <img className="absolute right-4 top-3 cursor-pointer" onClick={handleTogglePass} src={togglePass==='password'?'/eye.svg':'/eyeclosed.svg'} alt="Show Password" />
          </div>
          <button onClick={handleSignup}  className="w-3/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300">{isSignUp?'Signing Up....':'Sign Up'}</button>
        </div>
      </div>
  )
}

export default Signup
