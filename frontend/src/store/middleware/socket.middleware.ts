// import { Middleware } from "@reduxjs/toolkit";
// import { AppDispatch, RootState } from "../store.ts";
// import { ConnectionType } from "../../type/socket.type.ts";
// import { io, Socket } from "socket.io-client";
// import { IMessage } from "../../interface/message.interface.ts";
// import { messageActions } from "../slice/message.slice.ts";
// import { IConversation } from "../../interface/conversation.interface.ts";
// import { userActions } from "../slice/user.slice.ts";
// import { conversationActions } from "../slice/conversation.slice.ts";
// import { IUserFromConversation } from "../../interface/user.interface.ts";
//
// let socket: Socket;
//
// export const socketMiddleware: Middleware = ( store ) => ( next ) => async ( action ) => {
//    const { socketReducer, authReducer, conversationReducer } = store.getState() as RootState;
//
//    const dispatch = store.dispatch as AppDispatch;
//
//    let conversationWith;
//    let conversationId;
//
//    if (!socket && socketReducer.connect === ConnectionType.Disconnect && authReducer.isLogin) {
//
//       socket = io("ws://localhost:3200");
//
//       socket.connect();
//
//       socket.emit("add_user", authReducer.currentUserId);
//
//       socket.on("who_is_online", ( userIds: number[] ) => {
//          dispatch(userActions.setOnlineContacts(userIds));
//       });
//
//       socket.on("get_message", ( message: IMessage ) => {
//          dispatch(messageActions.addMessage(message));
//       });
//
//       socket.on("refresh_online_users", ( userIds: number[] ) => {
//          dispatch(userActions.setOnlineContacts(userIds));
//       });
//
//       socket.on("get_conversation", ( conversation: IConversation ) => {
//          dispatch(conversationActions.addConversation(conversation));
//       });
//
//       socket.on("get_delete_result", ( conversations: IConversation[], whoLeave: string ) => {
//          dispatch(conversationActions.setActionMessage(`${ whoLeave } закінчив(ла) бесіду `));
//          dispatch(conversationActions.setConversations(conversations));
//       });
//    }
//
//    if (socket && socketReducer.connect === ConnectionType.Connect) {
//
//       socket.on("get_delete_group_result", ( conversationId: number, adminName: string ) => {
//          const updated = conversationReducer.conversations.filter(c => c.id !== conversationId);
//
//          dispatch(conversationActions.setActionMessage(`Адмін ${ adminName } закрив бесіду`));
//          dispatch(conversationActions.setConversations(updated));
//       });
//
//       socket.on("get_leave_result", ( conversation: IConversation, whoLeft: string ) => {
//          const conv = conversationReducer.conversations;
//
//          const updated = conv.map(c => {
//             if (c.id === conversation.id) return conversation;
//             return c;
//          });
//
//          dispatch(conversationActions.setActionMessage(`${ whoLeft } покинув(ла) бесіду`));
//          dispatch(conversationActions.setConversations(updated));
//       });
//
//       switch (action.type) {
//          case "message/sendMessage/fulfilled":
//             socket.off();
//             socket.emit("send_message", action.payload);
//             socket.on("get_message", ( message: IMessage ) => {
//                dispatch(messageActions.addMessage(message));
//             });
//
//             break;
//
//          case "conversation/setActiveConversation":
//             socket.emit("conversation", action.payload.id);
//
//             break;
//
//          case "conversation/getConversations/fulfilled":
//             const lastConversation = action.payload.sort(( a: IConversation, b: IConversation ) => b.lastModified - a.lastModified)[0];
//             lastConversation && socket.emit("conversation", lastConversation.id);
//
//             break;
//
//          case "conversation/createConversation/fulfilled":
//             const userIds = action.meta.arg.userIds;
//             conversationWith = userIds.length ? userIds : userIds[0];
//
//             socket.emit("create_conversation", action.payload.id, authReducer.currentUserId, conversationWith);
//             socket.emit("conversation", action.payload.id);
//
//             break;
//
//          case "conversation/addConversation":
//             socket.emit("conversation", action.payload.id);
//
//             break;
//
//          case "conversation/deleteConversation/fulfilled":
//             conversationWith = action.meta.arg.conversation.conversationWith[0].id;
//             conversationId = action.meta.arg.conversation.id;
//             socket.emit("delete_conversation", conversationId, conversationWith, { id: authReducer.currentUserId, username: authReducer.currentUsername });
//
//             break;
//
//          case "conversation/leaveGroupConversation/fulfilled":
//             conversationWith = action.meta.arg.conversation.users
//                 .map(( u: IUserFromConversation ) => {
//                    if (u.id !== authReducer.currentUserId) return u.id;
//                    return null;
//                 })
//                 .filter(( id: number ) => id !== null);
//
//             conversationId = action.meta.arg.conversation.id;
//
//             socket.emit("leave_group_conversation", conversationId, conversationWith, authReducer.currentUsername);
//
//             break;
//
//          case "conversation/deleteGroupConversation/fulfilled":
//             conversationWith = action.meta.arg.conversation.users
//                 .map(( u: IUserFromConversation ) => {
//                    if (u.id !== authReducer.currentUserId) return u.id;
//                    return null;
//                 })
//                 .filter(( id: number ) => id !== null);
//
//             conversationId = action.meta.arg.conversation.id;
//
//             socket.emit("delete_group_conversation", conversationWith, conversationId, authReducer.currentUsername);
//
//             break;
//       }
//
//    }
//
//    return next(action);
//
// };