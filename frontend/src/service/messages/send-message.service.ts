import React from "react";

import { TypedOnChange2, TypedSetState } from "../../interface";
import { useAppDispatch, useAppSelector } from "../../hook";
import { messageAsyncActions } from "../../store/slice";

export const sendMessageService = ( setValue: TypedSetState<string>, value: string ) => {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const sendMessage = async () => {
      await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));
      setValue("");
   };

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
      if (e.key === "Enter") {
         e.preventDefault();
         setValue("");

         await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));
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
