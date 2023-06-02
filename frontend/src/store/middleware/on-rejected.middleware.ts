import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { appActions, authAsyncActions, conversationAsyncActions, messageAsyncActions, userAsyncActions } from "../slice";

export const onRejectedMiddleware = createListenerMiddleware();

onRejectedMiddleware.startListening({
   matcher: isAnyOf(
       authAsyncActions.login.rejected,
       userAsyncActions.getContacts.rejected,
       userAsyncActions.addContact.rejected,
       userAsyncActions.getCurrentUser.rejected,
       conversationAsyncActions.getConversations.rejected,
       conversationAsyncActions.deleteConversation.rejected,
       conversationAsyncActions.leaveGroupConversation.rejected,
       conversationAsyncActions.deleteGroupConversation.rejected,
       messageAsyncActions.deleteMessage.rejected,
       messageAsyncActions.getMessages.rejected,
       messageAsyncActions.sendMessage.rejected,
       userAsyncActions.uploadAvatar.rejected,
       userAsyncActions.deleteAvatar.rejected,
       userAsyncActions.findUser.rejected,
       authAsyncActions.logout.rejected,
   ),
   effect: ( action, api ) => {

      const dispatch = api.dispatch;

      const message = action.payload;

      dispatch(appActions.setActionMessage({ message: message, type: "error" }));
   }
});