import { createListenerMiddleware } from "@reduxjs/toolkit";
import { RootState } from "../store.ts";
import { conversationActions, conversationAsyncActions } from "../slice/conversation.slice.ts";
import { messageActions, messageAsyncActions } from "../slice/message.slice.ts";
import { io, Socket } from "socket.io-client";
import { userActions, userAsyncActions } from "../slice/user.slice.ts";
import { IMessage } from "../../interface/message.interface.ts";
import { IConversation } from "../../interface/conversation.interface.ts";
import { socketActions } from "../slice/socket.slice.ts";
import { authAsyncActions } from "../slice/auth.slice.ts";
import { IUserFromConversation } from "../../interface/user.interface.ts";

let socket: Socket;

export const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
   actionCreator: authAsyncActions.logout.fulfilled,
   effect: () => {
      socket.disconnect();
   }
});

listenerMiddleware.startListening({
   actionCreator: userAsyncActions.getCurrentUser.fulfilled,
   effect: ( _, api ) => {

      console.log("get current user");

      const { userReducer } = api.getState() as RootState;

      socket.emit("add_user", userReducer.currentUserInfo.id);

   }
});

listenerMiddleware.startListening({
   actionCreator: socketActions.connect,
   effect: async ( _, api ) => {

      console.log("socket connection");

      const dispatch = api.dispatch;

      socket = io("ws://localhost:3200");

      socket.connect();

      socket.on("who_is_online", ( userIds: number[] ) => {
         console.log("socket: who_is_online");
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on("refresh_online_users", ( userIds: number[] ) => {
         console.log("socket: refresh_online_users");
         dispatch(userActions.setOnlineContacts(userIds));
      });

      socket.on("get_conversation", ( conversation: IConversation ) => {
         console.log("socket: get_conversation");
         dispatch(conversationActions.addConversation(conversation));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.setActiveConversation,
   effect: async ( action, api ) => {

      console.log("set active conversation");

      const { userReducer, conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      socket.emit("conversation", action.payload.id);

      socket.off("get_message");

      socket.on("get_message", ( message: IMessage, conversationForSender: IConversation, conversationForReceiver: IConversation ) => {
         console.log("socket: get_message");

         const senderId = message.senderId;
         const currentUserId = userReducer.currentUserInfo.id;
         const conversationId = message.conversationId;
         const activeConversation = conversationReducer.activeConversation.id

         if (senderId === currentUserId && activeConversation === action.payload.id) {
            conversationForSender.isNewMessagesExist = false;
            dispatch(conversationActions.updateConversations(conversationForSender));
         }

         if (senderId !== currentUserId && activeConversation === action.payload.id) {
            conversationForReceiver.isNewMessagesExist = false;
            dispatch(conversationActions.updateConversations(conversationForReceiver));
         }

         if (senderId === currentUserId && conversationId !== action.payload.id) {
            dispatch(conversationActions.updateConversations(conversationForSender));
         }

         if (senderId !== currentUserId && conversationId !== action.payload.id) {
            dispatch(conversationActions.updateConversations(conversationForReceiver));
         }

      });

   },
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.getConversations.fulfilled,
   effect: async ( _, api ) => {

      console.log("get conversations");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      if (conversationReducer.conversations.length) {
         dispatch(conversationActions.setActiveConversation(conversationReducer.conversations[0]));
      }

      socket.on("get_conversation", ( conversation: IConversation ) => {
         console.log("socket: get_conversation");
         dispatch(conversationActions.addConversation(conversation));
      });

      if (await api.condition(() => Boolean(conversationReducer.conversations.length))) {

         socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
            console.log("socket: get_leave_result");
            dispatch(conversationActions.setActionMessage(`${ whoLeft } покинув(ла) бесіду`));
            dispatch(conversationActions.updateConversations(conversation));
         });

         socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
            console.log("socket: get_delete_result");
            dispatch(conversationActions.setActionMessage(`${ whoLeave } закінчив(ла) бесіду `));
            dispatch(conversationActions.deleteConversation(conversationId));
         });

         socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
            console.log("socket: get_delete_group_result");
            dispatch(conversationActions.setActionMessage(`Адмін ${ adminName } закрив бесіду`));
            dispatch(conversationActions.deleteConversation(conversationId));
         });

      }

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationActions.addConversation,
   effect: ( action, api ) => {

      console.log("add conversation");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      if (conversationReducer.conversations.length) {
         dispatch(conversationActions.setActiveConversation(action.payload));
      }

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         console.log("socket: get_leave_result");
         dispatch(conversationActions.setActionMessage(`${ whoLeft } покинув(ла) бесіду`));
         dispatch(conversationActions.updateConversations(conversation));
      });

      socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
         console.log("socket: get_delete_result");
         dispatch(conversationActions.setActionMessage(`${ whoLeave } закінчив(ла) бесіду `));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         console.log("socket: get_delete_group_result");
         dispatch(conversationActions.setActionMessage(`Адмін ${ adminName } закрив бесіду`));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.createConversation.fulfilled,
   effect: ( action, api ) => {

      console.log("create conversation");

      const { userReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const userIds = action.meta.arg.userIds;
      const conversationWith = userIds.length ? userIds : userIds[0];

      socket.emit("create_conversation", action.payload.id, userReducer.currentUserInfo.id, conversationWith);

      dispatch(conversationActions.setActiveConversation(action.payload));

      socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
         console.log("socket: get_leave_result");
         dispatch(conversationActions.setActionMessage(`${ whoLeft } покинув(ла) бесіду`));
         dispatch(conversationActions.updateConversations(conversation));
      });

      socket.on("get_delete_result", ( conversationId: number, whoLeave: string ) => {
         console.log("socket: get_delete_result");
         dispatch(conversationActions.setActionMessage(`${ whoLeave } закінчив(ла) бесіду `));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

      socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
         console.log("socket: get_delete_group_result");
         dispatch(conversationActions.setActionMessage(`Адмін ${ adminName } закрив бесіду`));
         dispatch(conversationActions.deleteConversation(conversationId));
      });

   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteConversation.fulfilled,
   effect: ( action, api ) => {

      console.log("delete conversation");

      const { userReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      dispatch(messageActions.resetMessages());

      const conversationWith = action.meta.arg.conversation.conversationWith[0].id;
      const conversationId = action.meta.arg.conversation.id;
      socket.emit("delete_conversation", conversationId, conversationWith, { id: userReducer.currentUserInfo.id, username: userReducer.currentUserInfo.username });
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.deleteGroupConversation.fulfilled,
   effect: ( action, api ) => {

      console.log("delete group conversation");

      const { userReducer } = api.getState() as RootState;

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== userReducer.currentUserInfo.id) return u.id;
             return null;
          })
          .filter(id => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("delete_group_conversation", conversationWith, conversationId, userReducer.currentUserInfo.username);
   }
});

listenerMiddleware.startListening({
   actionCreator: conversationAsyncActions.leaveGroupConversation.fulfilled,
   effect: ( action, api ) => {
      const { userReducer } = api.getState() as RootState;

      console.log("leave group conversation");

      const conversationWith = action.meta.arg.conversation.users
          .map(( u: IUserFromConversation ) => {
             if (u.id !== userReducer.currentUserInfo.id) return u.id;
             return null;
          })
          .filter(( id ) => id !== null);

      const conversationId = action.meta.arg.conversation.id;

      socket.emit("leave_group_conversation", conversationId, conversationWith, userReducer.currentUserInfo.username);
   }
});

listenerMiddleware.startListening({
   actionCreator: messageAsyncActions.getMessages.fulfilled,
   effect: ( action, api ) => {

      console.log("get messages");

      const { conversationReducer } = api.getState() as RootState;

      const dispatch = api.dispatch;

      const conversationId = action.meta.arg.conversationId;

      if (conversationReducer.activeConversation.id === conversationId) {
         const updatedConversation = JSON.parse(JSON.stringify(conversationReducer.conversations.find(c => c.id === conversationId)));
         updatedConversation.isNewMessagesExist = false;

         dispatch(conversationActions.updateConversations(updatedConversation));
      }
   }
});

listenerMiddleware.startListening({
   actionCreator: messageAsyncActions.sendMessage.fulfilled,
   effect: ( action ) => {

      console.log("send message");

      socket.emit("send_message", action.payload);
   }
});
