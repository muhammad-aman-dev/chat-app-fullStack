import { MessageSquareText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../store/slices/authslice';

const Navbar = () => {
    const {authUser, isCheckingAuth}= useSelector((state)=>state.auth)
  return (
    <header>
        <nav className='flex justify-between items-center sm:pt-6 sm:px-6'>
           <div className='flex items-center'><MessageSquareText color='#EAB308'/> <h2 className='text-xl font-bold bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 bg-clip-text text-transparent'> WeChat </h2> </div>
           {authUser && (
           <button onClick={logOut} class="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400 shadow-lg hover:shadow-amber-400/50 transition-all cursor-pointer hover:scale-105 duration-300">Logout</button>
           )}
        </nav>
    </header>
  )
}

export default Navbar
