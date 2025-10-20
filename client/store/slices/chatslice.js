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

export const setSelectedUser = createAsyncThunk('message/:id',async(user,thunkAPI)=>{
  console.log(user._id)
  try{
    const res = await axiosInstance.get(`message/${user._id}`);
    console.log(res.data)
    let data = {
      messages : res.data.messages,
      selecteduser : user
    }
    return data;
  }
  catch(err){
   toast('Error While Fetching Chat...');
   console.log(err);
  }
})



const chatSlice= createSlice({
    name : 'chat',
    initialState : {
        allUsers : [],
        chatedUsers : [],
        isLoadingChatList : false,
        selectedChat : null,
        chatWithUser : null,
        isLoadingChat : false
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
        .addCase(setSelectedUser.fulfilled,(state,action)=>{
          state.chatWithUser = action.payload.messages;
          state.selectedChat = action.payload.selecteduser;
          state.isLoadingChat = false;
        })
        .addCase(setSelectedUser.rejected,(state)=>{
          state.isLoadingChat = false;
        })
        .addCase(setSelectedUser.pending,(state)=>{
          state.isLoadingChat = true;
        })

    }
})


export const { setallUsers } = chatSlice.actions;
export default chatSlice.reducer;