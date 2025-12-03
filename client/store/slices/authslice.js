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


export const login = createAsyncThunk('user/signin', async(data,thunderAPI)=>{
    try {
        let res = await axiosInstance.post('user/signin',data);
        connectSocket(res.data.user);
        toast.success('Login Successfully');
        return res.data.user;
    } catch (error) {
        toast.error(error.response.data.message);
        return thunderAPI.rejectWithValue(error.response.data.message);
    }
 })

 export const signup = createAsyncThunk('user/signup', async(data,thunderAPI)=>{
    try {
        let res = await axiosInstance.post('user/signup',data);
        connectSocket(res.data.user);
        toast.success('Registered Successfully');
        return res.data.user;
    } catch (error) {
        toast.error(error.response.data.message);
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
        isUpdatingProfile : false,
    },
    reducers : {
        setOnlineUsers(state, action){
            state.onlineUsers = action.payload;
            console.log(state.onlineUsers)
        },
        setIsUpdatingProfile(state, action){
            state.isUpdatingProfile = action.payload;
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
        })
        .addCase(login.pending, (state)=>{
            state.isLoggingIn = true;
        })
        .addCase(login.fulfilled,(state, action)=>{
            state.authUser = action.payload;       
            state.isLoggingIn = false;
            console.log(state.authUser)
        })
        .addCase(login.rejected, (state)=>{
            state.isLoggingIn= false;
        })
        .addCase(signup.pending, (state)=>{
            state.isSignUp = true;
        })
        .addCase(signup.fulfilled,(state, action)=>{
            state.authUser = action.payload;       
            state.isSignUp = false;
            console.log(state.authUser)
        })
        .addCase(signup.rejected, (state)=>{
            state.isSignUp = false;
        })

    }
});


export const {setOnlineUsers , setIsUpdatingProfile} = authSlice.actions;

export default authSlice.reducer; 