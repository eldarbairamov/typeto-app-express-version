import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { conversationActions, conversationAsyncActions } from "../slice/conversation.slice.ts";
import { messageActions, messageAsyncActions } from "../slice/message.slice.ts";
import { io, Socket } from "socket.io-client";
import { userActions } from "../slice/user.slice.ts";
import { IMessage } from "../../interface/message.interface.ts";
import { IConversation } from "../../interface/conversation.interface.ts";
import { IUserFromConversation } from "../../interface/user.interface.ts";
import { socketActions } from "../slice/socket.slice.ts";

let socket: Socket;

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
   actionCreator: socketActions.connect,
   effect: ( _, api ) => {
      const dispatch = api.dispatch;

      const { authReducer } = api.getState() as RootState;

      console.log("socket connection");

      socket = io("ws://localhost:3200");

      socket.connect();

      socket.emit("add_user", authReducer.currentUserId);

      socket.on("who_is_online", ( userIds: number[] ) => {
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on("refresh_online_users", ( userIds: number[] ) => {
         dispatch(userActions.setOnlineContacts(userIds));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.getConversations.fulfilled,
   effect: ( _, api ) => {
      console.log("get conversations");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      socket.on("get_conversation", ( conversation: IConversation ) => {
         dispatch(conversationActions.addConversation(conversation));
      });

      const isConversationsExist = Boolean(conversationReducer.conversations.length);

      if (isConversationsExist) {
         const lastConversation = conversationReducer.conversations[0];
         socket.emit("conversation", lastConversation.id);
      }
   }
});

listenerMiddleware.startListening({
   matcher: isAnyOf(
       conversationAsyncActions.getConversations.fulfilled,
       conversationAsyncActions.createConversation.fulfilled,
       conversationActions.addConversation,
       conversationActions.setActiveConversation
   ),
   effect: ( _, api ) => {
      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         const updated = conversationReducer.conversations.map(c => {
            if (c.id === conversation.id) return conversation;
            return c;
         });

         dispatch(conversationActions.setActionMessage(`${ whoLeft } покинув(ла) бесіду`));
         dispatch(conversationActions.setConversations(updated));
      });

      socket.on("get_delete_result", ( conversations: IConversation[], whoLeave: string ) => {
         dispatch(conversationActions.setActionMessage(`${ whoLeave } закінчив(ла) бесіду `));
         dispatch(conversationActions.setConversations(conversations));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         const updated = conversationReducer.conversations.filter(c => c.id !== conversationId);

         dispatch(conversationActions.setActionMessage(`Адмін ${ adminName } закрив бесіду`));
         dispatch(conversationActions.setConversations(updated));
      });

      socket.on("get_message", ( message: IMessage ) => {
         if (message.conversationId === conversationReducer.activeConversation.id) {
            dispatch(messageActions.addMessage(message));
         }
         else {
            const conversationsCopy = JSON.parse(JSON.stringify(conversationReducer.conversations)) as IConversation[];

            const updated = conversationsCopy.map(c => {
               if (c.id === message.conversationId) {
                  c.lastMessage = message;
                  return c;
               }
               return c;
            });

            dispatch(conversationActions.updateConversations(updated));
         }
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.createConversation.fulfilled,
   effect: ( action, api ) => {
      const { authReducer } = api.getState() as RootState;

      console.log("create conversation");

      const userIds = action.meta.arg.userIds;
      const conversationWith = userIds.length ? userIds : userIds[0];

      socket.emit("create_conversation", action.payload.id, authReducer.currentUserId, conversationWith);
      socket.emit("conversation", action.payload.id);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteConversation.fulfilled,
   effect: ( action, api ) => {
      const { authReducer } = api.getState() as RootState;

      console.log("delete conversation");

      const conversationWith = action.meta.arg.conversation.conversationWith[0].id;
      const conversationId = action.meta.arg.conversation.id;
      socket.emit("delete_conversation", conversationId, conversationWith, { id: authReducer.currentUserId, username: authReducer.currentUsername });
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.leaveGroupConversation.fulfilled,
   effect: ( action, api ) => {
      const { authReducer } = api.getState() as RootState;

      console.log("leave group conversation");

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== authReducer.currentUserId) return u.id;
             return null;
          })
          .filter(( id ) => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("leave_group_conversation", conversationId, conversationWith, authReducer.currentUsername);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteGroupConversation.fulfilled,
   effect: ( action, api ) => {
      const { authReducer } = api.getState() as RootState;

      console.log("delete group conversation");

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== authReducer.currentUserId) return u.id;
             return null;
          })
          .filter(id => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("delete_group_conversation", conversationWith, conversationId, authReducer.currentUsername);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.setActiveConversation,
   effect: ( action ) => {
      console.log("set active conversation");

      socket.emit("conversation", action.payload.id);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.addConversation,
   effect: ( action ) => {

      console.log("add conversation");

      socket.emit("conversation", action.payload.id);
   }
});

listenerMiddleware.startListening({
   actionCreator: messageAsyncActions.sendMessage.fulfilled,
   effect: ( action, api ) => {

      const dispatch = api.dispatch;

      console.log("send message");

      socket.off();
      socket.emit("send_message", action.payload);

      socket.on("get_message", ( message: IMessage, conversations: IConversation[] ) => {
         dispatch(messageActions.addMessage(message));
         dispatch(conversationActions.updateConversations(conversations));
      });
   }
});

