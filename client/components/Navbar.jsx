import { MessageSquareText, UserRound } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../store/slices/authslice';
import { setIsUpdatingProfile } from '../store/slices/authslice';

const Navbar = () => {
  const { authUser, isCheckingAuth , isUpdatingProfile} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header className='p-3 sm:p-0'>
      <nav className='flex justify-between items-center sm:pt-6 sm:px-6'>
        <div className='flex items-center'>
          <MessageSquareText color='#3B82F6' /> 
          <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1'>
            WeChat
          </h2>
        </div>
        {authUser && (
        <div className='flex gap-3 sm:gap-10 items-center'>
          <div className='flex items-center'>
            <div className='flex flex-col justify-center'>
            <span className='text-lg hidden sm:inline-block font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1'>{authUser.fullName}</span>
            <span className='text-xs hidden sm:inline-block font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1'>{authUser.email}</span>
            </div>
            <div onClick={()=>{dispatch(setIsUpdatingProfile(!isUpdatingProfile))}} className='flex cursor-pointer flex-col gap-1 items-center justify-center'>
          <UserRound color='#5856d6' strokeWidth={'2.25px'} className='hover:scale-105 duration-300 cursor-pointer'/>
           <span className='bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent text-xs'>Update Profile</span>
          </div>
        </div>
          <button
            onClick={() => dispatch(logOut())}
            className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300"
          >
            Logout
          </button>
        </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
