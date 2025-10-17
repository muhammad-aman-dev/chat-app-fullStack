import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { connectSocket, disConnectSocket } from "../../lib/socket.js";
import { toast } from "react-toastify";

export const getUser = createAsyncThunk("user/me", async(_, thunkAPI) => {
    try {
        const res= await axiosInstance.get('user/me');
        connectSocket(res.data.user)
        return res.data.user;
    } catch (error) {
        console.log("Error fetching user: ",error);
        return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch user");
    }
});

 export const logOut = createAsyncThunk('user/signout', async(_,thunderAPI)=>{
    try {
        await axiosInstance.get('user/signout');
        disConnectSocket();
        return null;
    } catch (error) {
        toast.error(error.response.data.message || "Error Logging Out....")
        return thunderAPI.rejectWithValue(error.response.data.message);
    }
 })


const authSlice = createSlice({
    name : 'auth',
    initialState : {
        authUser : null ,
        isSignUp : false ,
        isLoggingIn : false ,
        isUpdatingProfile : false ,
        isCheckingAuth : false ,
        onlineUsers : [],
    },
    reducers : {
        setOnlineUsers(state, action){
            state.onlineUsers = action.payload;
        }
    },
    extraReducers : (builder)=>{
            builder.addCase(getUser.pending, (state) => {
            state.isCheckingAuth = true;
        })
        .addCase(getUser.fulfilled, (state, action)=>{
            state.authUser = action.payload;
            state.isCheckingAuth = false;
        })
        .addCase(getUser.rejected, (state, action)=>{
            state.authUser = null;
            state.isCheckingAuth = false;
        })
        .addCase(logOut.fulfilled, (state)=>{
            state.authUser = null;
        })
        .addCase(logOut.rejected, (state)=>{
            state.authUser = state.authUser;
        });
    }
});


export const {setOnlineUsers} = authSlice.actions;

export default authSlice.reducer; 