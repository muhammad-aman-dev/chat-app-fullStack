import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-toastify";

export const getChatedusers=createAsyncThunk('message/getchatusers',async(userId,thunkAPI)=>{
  try {
   const res = await axiosInstance.get(`message/getchatusers/${userId}`);
   console.log(res.data)
   return res.data;
  } catch (error) {
    console.log("Error fetching Chats: ",error);
    toast.error("Error fetching Chats: ",error);
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch Chats");
  }
})



const chatSlice= createSlice({
    name : 'chat',
    initialState : {
        allUsers : [],
        chatedUsers : [],
        isLoadingChatList : false,

    },
    reducers : {
     setallUsers(state,action){
       state.allUsers=action.payload;
     }
    },
    extraReducers : (builder)=>{
        builder
        .addCase(getChatedusers.pending,(state)=>{
          state.isLoadingChatList=true;
        })
        .addCase(getChatedusers.fulfilled,(state, action)=>{
            state.chatedUsers = action.payload;
            state.isLoadingChatList= false;

        })
        .addCase(getChatedusers.rejected,(state)=>{
          state.isLoadingChatList=false;
        })

    }
})


export const { setallUsers } = chatSlice.actions;
export default chatSlice.reducer;