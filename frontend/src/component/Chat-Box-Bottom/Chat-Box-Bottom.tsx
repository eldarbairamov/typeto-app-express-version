import { Box, HStack, Textarea } from "@chakra-ui/react";
import { useInputHandler } from "../../hook/use-input-handler.ts";
import { messageAsyncActions } from "../../store/slice/message.slice.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { MAIN_COLOR } from "../../constant/color.constant.ts";
import { MdOutlineTextsms } from "react-icons/all";
import { ButtonIcon } from "../UI/Button-Icon/Button-Icon.tsx";

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

   return (
       <HStack h={ "100px" }
               justify={ "center" }
               w={ "100%" }>

          <Box w={ "60%" }
               bg={ "#eff0f3" }
               rounded={ 15 }
               padding={ 3 }>

             <Textarea rows={ 1 }
                       resize={ "none" }
                       bg={ "#eff0f3" }
                       wordBreak={ "break-word" }
                       border={ "none" }
                       value={ value }
                       onChange={ handleChange }
                       focusBorderColor={ "transparent" }
                       placeholder={ "Написати..." }/>
          </Box>

          <ButtonIcon size={ 12 }
                      as={ MdOutlineTextsms }
                      color={ MAIN_COLOR }
                      fn={ value !== "" ? sendMessage : undefined }/>

       </HStack>

   );
}