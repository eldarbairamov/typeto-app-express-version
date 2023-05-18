import { Middleware } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "../store.ts";
import { ConnectionType } from "../../type/socket.type.ts";
import { io, Socket } from "socket.io-client";
import { IMessage } from "../../interface/message.interface.ts";
import { messageActions } from "../slice/message.slice.ts";
import { IConversation } from "../../interface/conversation.interface.ts";
import { userActions } from "../slice/user.slice.ts";
import { conversationActions } from "../slice/conversation.slice.ts";

let socket: Socket;

export const socketMiddleware: Middleware = ( store ) => ( next ) => async ( action ) => {
   const { socketReducer, authReducer } = store.getState() as RootState;

   const dispatch = store.dispatch as AppDispatch;

   if (!socket && socketReducer.connect === ConnectionType.Disconnect && authReducer.isLogin) {
      socket = io('ws://localhost:3200');

      socket.connect();

      socket.emit('add_user', authReducer.currentUserId);

      socket.on('who_is_online', ( userIds: number[] ) => {
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on('get_message', ( message: IMessage ) => {
         dispatch(messageActions.addMessage(message));
      });

      socket.on("refresh_online_users", ( userIds: number[] ) => {
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on('get_conversation', ( conversation ) => {
         dispatch(conversationActions.addConversation(conversation));
      });

   }

   if (socket && socketReducer.connect === ConnectionType.Connect) {

      if (action.type === "message/sendMessage/fulfilled") {
         socket.off();

         socket.emit('send_message', action.payload);

         socket.on('get_message', ( message: IMessage ) => {
            dispatch(messageActions.addMessage(message));
         });
      }

      switch (action.type) {

         case "conversation/setActiveConversation":
            socket.emit('conversation', action.payload);
            break;

         case "conversation/getConversations/fulfilled":
            const lastConversation = action.payload.sort(( a: IConversation, b: IConversation ) => b.lastModified - a.lastModified);
            lastConversation.length && socket.emit('conversation', lastConversation[0]);
            break;

         case "conversation/createConversation/fulfilled":
            socket.emit('conversation', action.payload);

            const conversation = JSON.parse(JSON.stringify(action.payload));
            conversation.conversationWith[0].username = authReducer.currentUsername;

            socket.emit('create_conversation', conversation);
            break;

         case "conversation/addConversation":
            socket.emit('conversation', action.payload);
      }

   }


   return next(action);
};