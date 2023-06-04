import React, { useEffect } from "react";

import { TypedOnChange2, TypedSetState } from "../../interface";
import { useAppDispatch, useAppSelector, useDebounce } from "../../hook";
import { appActions, messageAsyncActions } from "../../store/slice";

export const sendMessageService = ( setValue: TypedSetState<string>, value: string ) => {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const debounced = useDebounce(value);

   const dispatch = useAppDispatch();

   const sendMessage = async () => {
      await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));
      setValue("");
   };

   useEffect(() => {
      if (debounced) dispatch(appActions.setIsImTyping(false));

   }, [ debounced ]);

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
      dispatch(appActions.setIsImTyping(true));

      if (e.key === "Enter") {
         e.preventDefault();

         Boolean(value.charAt(0) !== "\n") && await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));

         setValue("");
      }
   };

   const sendImage = async ( e: TypedOnChange2 ) => {
      const image = (e.target.files as FileList)[0];
      const formData = new FormData();
      formData.append("image", image);
      formData.append("conversationId", String(activeConversation.id));

      await dispatch(messageAsyncActions.sendImage({ formData }));
   };

   return { sendMessage, onEnterDown, sendImage };

};
