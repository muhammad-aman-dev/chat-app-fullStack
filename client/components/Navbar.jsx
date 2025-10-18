import { MessageSquareText } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logOut } from '../store/slices/authslice';

const Navbar = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  return (
    <header>
      <nav className='flex justify-between items-center sm:pt-6 sm:px-6'>
        <div className='flex items-center'>
          <MessageSquareText color='#3B82F6' /> 
          <h2 className='text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 bg-clip-text text-transparent ml-1'>
            WeChat
          </h2>
        </div>

        {authUser && (
          <button
            onClick={() => dispatch(logOut())}
            className="px-5 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 shadow-lg hover:shadow-indigo-400/50 transition-all cursor-pointer hover:scale-105 duration-300"
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
