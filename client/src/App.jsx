import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUser, setOnlineUsers } from '../store/slices/authslice.js';
import { connectSocket, disConnectSocket } from '../lib/socket.js';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from "../pages/Home.jsx";
import Navbar from '../components/Navbar.jsx';
import Login from '../pages/Login.jsx';


function App() {
  const {authUser, isCheckingAuth}=useSelector((state)=>state.auth)
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser())
  }, [getUser])
  
  useEffect(() => {
    if(authUser){
      const socket= connectSocket(authUser._id);

      socket.on("getOnlineUsers", (users)=>{
        dispatch(setOnlineUsers(users));
      });
      return ()=> disConnectSocket();
    }
  }, [authUser])
  
  if(isCheckingAuth && !authUser){
    return (
      <div className='text-center w-full h-[100vh] font-bold text-black'>Loading.....</div>
    )
  }

  return (
    <>
    <Navbar/>
      <Router>
        <Routes>
          <Route path='/' element={authUser ? <Home/> : <Navigate to={"/login"}/>}/>
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
