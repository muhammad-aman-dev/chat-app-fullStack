import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, setOnlineUsers } from '../store/slices/authslice.js';
import { setChatwithUser } from '../store/slices/chatslice.js';
import { connectSocket, disConnectSocket, getSocket } from '../lib/socket.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "../pages/Home.jsx";
import Navbar from '../components/Navbar.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';


function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const { chatWithUser } = useSelector((state)=> state.chat);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
  if (!authUser) return;

  const socket = getSocket() || connectSocket(authUser._id);

  socket.on("getOnlineUsers", (users) => {
    dispatch(setOnlineUsers(users));
    
  });
  socket.on("newMessage", (message)=>{
    console.log('fire')
    dispatch(setChatwithUser(message));
  })

  return () => {
    socket.off("getOnlineUsers");
  };
}, [authUser, dispatch]);

useEffect(() => {
  if (!authUser) {
    disConnectSocket();
  }
}, [authUser]);


  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh] bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loader2 className="animate-spin text-blue-600 w-10 h-10 mb-4" />
        <p className="font-semibold text-lg text-gray-700">Loading your WeChat experience...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
          <Route path='/login' element={!authUser ? <Login /> : <Navigate to={"/"} />} />
          <Route path='/signup' element={!authUser ? <Signup /> : <Navigate to={"/"} />} />
        </Routes>
      </Router>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        toastStyle={{
          background: 'linear-gradient(to right, #3b82f6, #6366f1)',
          color: '#fff',
          borderRadius: '0.75rem',
          boxShadow: '0 4px 10px rgba(99,102,241,0.3)',
          fontWeight: '500',
          fontSize: '0.875rem',
          fontFamily: 'Inter, sans-serif',
        }}
        progressStyle={{
          background: '#a5b4fc',
        }}
      />
    </>
  );
}

export default App;
