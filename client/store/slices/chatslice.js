import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios.js";
import { toast } from "react-toastify";

// ✅ Fetch all users
export const getAllUsers = createAsyncThunk("chat/getAllUsers", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("message/allusers");
    return res.data.users;
  } catch (error) {
    console.error("Error fetching all users:", error);
    toast.error("Error fetching all users");
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch users");
  }
});

// ✅ Fetch all chats of a user
export const getChatedusers = createAsyncThunk("message/getchatusers", async (userId, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`message/getchatusers/${userId}`);
    return res.data;
  } catch (error) {
    console.error("Error fetching Chats:", error);
    toast.error("Error fetching Chats");
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to fetch Chats");
  }
});

// ✅ Select a user to chat with
export const setSelectedUser = createAsyncThunk("message/:id", async (user, thunkAPI) => {
  try {
    const res = await axiosInstance.get(`message/${user._id}`);
    return {
      messages: res.data.messages,
      selecteduser: user,
    };
  } catch (err) {
    toast.error("Error while fetching chat...");
    console.error(err);
    return thunkAPI.rejectWithValue(err.response?.data || "Failed to fetch chat");
  }
});

// ✅ Send message
export const setsendMessage = createAsyncThunk("message/send/:id", async (message, thunkAPI) => {
  try {
    const { id, data } = message;
    const response = await axiosInstance.post(`message/send/${id}`, data);
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error("Error sending message...");
    return thunkAPI.rejectWithValue(error.response?.data || "Failed to send message");
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    allUsers: [],
    chatedUsers: [],
    isLoadingChatList: false,
    selectedChat: null,
    chatWithUser: null,
    isLoadingChat: false,
    isSendingMessage: false,
    isChoosingNew: false,
    latestMessage : null,
  },
  reducers: {
    setChatwithUser(state, action) {
      if (state.chatWithUser) {
        state.chatWithUser = [...state.chatWithUser, action.payload];
      } else {
        state.chatWithUser = [action.payload];
      }
    },
    setChoosingNew(state, action) {
      state.isChoosingNew = action.payload;
    },
    setChatedUsers(state, action) {
      const payload = action.payload;

  if (Array.isArray(payload)) {
    // whole array update
    state.chatedUsers = payload;
  } else if (payload && typeof payload === "object") {
    // single object -> add to array safely
    const exists = state.chatedUsers.some((u) => u.userId === payload.userId);
    if (!exists) {
      state.chatedUsers.unshift(payload);
    }
  } else {
    console.warn("Invalid payload for setChatedUsers:", payload);
  }
    },
    setLatestMessage(state, action){
      state.latestMessage = action.payload;
    },
    setselectedChat(state, action){
      state.selectedChat = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.isLoadingChatList = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.allUsers = action.payload;
        state.isLoadingChatList = false;
      })
      .addCase(getAllUsers.rejected, (state) => {
        state.isLoadingChatList = false;
      })

      // ✅ Get chated users
      .addCase(getChatedusers.pending, (state) => {
        state.isLoadingChatList = true;
      })
      .addCase(getChatedusers.fulfilled, (state, action) => {
        state.chatedUsers = action.payload;
        state.isLoadingChatList = false;
      })
      .addCase(getChatedusers.rejected, (state) => {
        state.isLoadingChatList = false;
      })

      // ✅ Select user
      .addCase(setSelectedUser.pending, (state) => {
        state.isLoadingChat = true;
      })
      .addCase(setSelectedUser.fulfilled, (state, action) => {
        state.chatWithUser = action.payload.messages;
        state.selectedChat = action.payload.selecteduser;
        state.isLoadingChat = false;
      })
      .addCase(setSelectedUser.rejected, (state) => {
        state.isLoadingChat = false;
      })

      // ✅ Send message
      .addCase(setsendMessage.pending, (state) => {
        state.isSendingMessage = true;
      })
      .addCase(setsendMessage.fulfilled, (state, action) => {
        state.isSendingMessage = false;
        if (state.chatWithUser) {
          state.chatWithUser = [...state.chatWithUser, action.payload];
        } else {
          state.chatWithUser = [action.payload];
        }
      })
      .addCase(setsendMessage.rejected, (state) => {
        state.isSendingMessage = false;
      });
  },
});

export const { setChatwithUser, setChoosingNew, setselectedChat, setChatedUsers, setLatestMessage } = chatSlice.actions;
export default chatSlice.reducer;
