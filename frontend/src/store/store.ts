import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slice/auth.slice.ts";
import { userReducer } from "./slice/user.slice.ts";
import { conversationReducer } from "./slice/conversation.slice.ts";

export const store = configureStore({
    reducer: {
        authReducer,
        userReducer,
        conversationReducer
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
