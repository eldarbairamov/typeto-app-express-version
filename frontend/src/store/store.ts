import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./slice/auth.slice.ts";
import { userReducer } from "./slice/user.slice.ts";
import { conversationReducer } from "./slice/conversation.slice.ts";
import { messageReducer } from "./slice/message.slice.ts";
import { socketReducer } from "./slice/socket.slice.ts";
import { socketMiddleware } from "./middleware/socket.middleware.ts";

export const store = configureStore({
   reducer: {
      authReducer,
      userReducer,
      conversationReducer,
      messageReducer,
      socketReducer
   },
   middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(socketMiddleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
