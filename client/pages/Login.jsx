import { useState } from "react"
import { MessageSquareText } from "lucide-react"
import { Link } from "react-router-dom"

const Login = () => {
   const [togglePass, settogglePass] = useState('password');

   function handleTogglePass() {
    (togglePass=='password')?settogglePass('text'):settogglePass('password');
   }

  return (
    <div className="flex flex-col gap-7 bg-gray-100/98 mt-7 p-10">
      <div className="text-area flex flex-col items-center m-auto justify-center ">
      <div className='flex items-center  justify-center'><MessageSquareText color='#EAB308'/> <h2 className='text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent'> WeChat </h2> </div>
        <p className="text-[#EAB308] sm:text-xl mt-3">Chat securely with your friends — simple, fast, and end-to-end encrypted.</p>
      </div>
      <div className="form  flex flex-col gap-8 items-center" >
      <input type="email" placeholder="Enter Your Email" className="w-full font-bold outline-1 outline-[#EAB308] text-[#EAB308] focus:shadow-md p-3 rounded-2xl shadow-[#EAB308]"/>
      <div className="w-full relative">
      <input type={togglePass} placeholder="Enter Your Password" className="w-full font-bold outline-1 outline-[#EAB308] text-[#EAB308] focus:shadow-md p-3 rounded-2xl shadow-[#EAB308]"/>
      <img className="absolute right-4 top-3 cursor-pointer" onClick={handleTogglePass} src={togglePass==='password'?'/eye.svg':'/eyeclosed.svg'} alt="Show Password" />
      </div>
      <button className="w-3/4 sm:w-1/4 px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 shadow-lg hover:shadow-amber-400/50 transition-all cursor-pointer hover:scale-105 duration-300">Login</button>
      <div className="text-[#EAB308] flex flex-col items-center sm:flex-row  sm:justify-between w-full">
      <button className=" underline">Forgot Password?</button>
      <div><span>Not Registered?</span><Link to={'/signup'} className="underline ">Sign Up Now</Link></div>
      </div>
      </div>
    </div>
  )
}

export default Login
