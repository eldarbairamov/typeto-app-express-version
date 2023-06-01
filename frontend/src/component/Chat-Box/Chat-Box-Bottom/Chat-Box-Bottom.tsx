import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { useInputHandler } from "../../../hook/use-input-handler.ts";
import { messageAsyncActions } from "../../../store/slice/message.slice.ts";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { MAIN_COLOR } from "../../../constant/color.constant.ts";
import { AiOutlineMessage, RxImage } from "react-icons/all";
import { ButtonIcon } from "../../UI/Button-Icon/Button-Icon.tsx";
import React, { useRef } from "react";
import { TypedOnChange2 } from "../../../interface/common.interface.ts";

export function ChatBoxBottom() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const { value, handleChange, setValue } = useInputHandler();

   const sendMessage = async () => {
      const result = await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));
      if (messageAsyncActions.sendMessage.rejected.match(result)) {
         console.log(result.payload);
      }

      setValue("");
   };

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLTextAreaElement> ) => {
      if (e.key === "Enter") {
         e.preventDefault();
         setValue("");
         const result = await dispatch(messageAsyncActions.sendMessage({ conversationId: activeConversation.id, content: value }));
         if (messageAsyncActions.sendMessage.rejected.match(result)) {
            console.log(result.payload);
         }
      }
   };

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const sendImage = async ( e: TypedOnChange2 ) => {
      const image = (e.target.files as FileList)[0];
      const formData = new FormData();
      formData.append("image", image);
      formData.append("conversationId", String(activeConversation.id));

      await dispatch(messageAsyncActions.sendImage({ formData }));
   };

   return (
       <HStack h={ "100px" }
               justify={ "center" }
               w={ "100%" }>

          <ButtonIcon size={ 10 }
                      as={ RxImage }
                      color={ MAIN_COLOR }
                      fn={ handlePick }/>

          <Box w={ "60%" }
               bg={ "#eff0f3" }
               rounded={ 15 }
               padding={ 3 }>

             <Textarea rows={ 1 }
                       resize={ "none" }
                       bg={ "#eff0f3" }
                       wordBreak={ "break-word" }
                       border={ "none" }
                       onKeyDown={ onEnterDown }
                       value={ value }
                       onChange={ handleChange }
                       focusBorderColor={ "transparent" }
                       placeholder={ "Написати..." }/>
          </Box>

          <ButtonIcon size={ 10 }
                      as={ AiOutlineMessage }
                      color={ MAIN_COLOR }
                      fn={ value !== "" ? sendMessage : undefined }/>

          <Input style={ { display: "none" } }
                 onChange={ sendImage }
                 type={ "file" }
                 ref={ ref }/>

       </HStack>

   );
}