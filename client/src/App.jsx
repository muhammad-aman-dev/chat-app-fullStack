import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, setOnlineUsers } from '../store/slices/authslice.js';
import { setChatwithUser, setChatedUsers, setLatestMessage } from '../store/slices/chatslice.js';
import { connectSocket, disConnectSocket, getSocket } from '../lib/socket.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "../pages/Home.jsx";
import Navbar from '../components/Navbar.jsx';
import Login from '../pages/Login.jsx';
import Signup from '../pages/Signup.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader2 } from 'lucide-react';
import { getAllUsers } from '../store/slices/chatslice.js';

function App() {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const { chatedUsers, selectedChat, latestMessage } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  // ✅ Fetch logged-in user and all users
  useEffect(() => {
    dispatch(getUser());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (!authUser) return;

    const socket = getSocket() || connectSocket(authUser._id);

    socket.on("getOnlineUsers", (users) => {
      dispatch(setOnlineUsers(users));
    });

    socket.on("newMessage", (message) => {
      console.log('🔥 New message received');
      if (selectedChat?._id === message.sender) {
        dispatch(setChatwithUser(message));
      }

      const exists = chatedUsers.some((user) => user.userId === message.sender);
      if (!exists) {
        dispatch(setChatedUsers({ userId: message.sender }));
      }
      dispatch(setLatestMessage({userId : message.sender }));
    });

    return () => {
      socket.off("getOnlineUsers");
      socket.off("newMessage");
    };
  }, [authUser, dispatch, chatedUsers, selectedChat]);

  useEffect(() => {
    if (!authUser) {
      disConnectSocket();
    }
  }, [authUser]);

  useEffect(() => {
    console.log(chatedUsers)
  }, [chatedUsers])
  
 useEffect(() => {
  if (!latestMessage?.userId) return;

  const userId = latestMessage.userId;

  const index = chatedUsers.findIndex((u) => u.userId === userId);

  if (index !== -1) {
    const updated = [...chatedUsers];
    const [existing] = updated.splice(index, 1);
    updated.unshift({
      ...existing,
      lastMessageTime: new Date().toISOString(), 
    });
    dispatch(setChatedUsers(updated));
  } else {
    
    const newUser = {
      userId,
      lastMessage: "New message", 
      lastMessageTime: new Date().toISOString(),
      avatar: { id: "", url: "" },
    };
    dispatch(setChatedUsers([newUser, ...chatedUsers]));
  }
}, [latestMessage]);

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
          <Route path="/" element={authUser ? <Home /> : <Navigate to="/login" />} />
          <Route path="/login" element={!authUser ? <Login /> : <Navigate to="/" />} />
          <Route path="/signup" element={!authUser ? <Signup /> : <Navigate to="/" />} />
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
