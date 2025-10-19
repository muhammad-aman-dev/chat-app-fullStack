import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authslice.js";
import chatReducer from "./slices/chatslice.js";


const store= configureStore({
    reducer : {
        auth : authReducer,
        chat : chatReducer
    },
})

export default store;