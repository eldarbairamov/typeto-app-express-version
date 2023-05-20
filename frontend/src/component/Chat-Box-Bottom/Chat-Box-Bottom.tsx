import { Box, Button, HStack, Textarea } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { SiTelegram } from "react-icons/all";
import { useInputHandler } from "../../hook/use-input-handler.ts";
import { messageAsyncActions } from "../../store/slice/message.slice.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { MAIN_COLOR, MAIN_COLOR_HOVER } from "../../constant/color.constant.ts";

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
               rounded={ 20 }
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

          <Button bg={ "transparent" }
                  height={ "50px" }
                  color={ "white" }
                  onClick={ sendMessage }
                  _hover={ { bg: "transparent" } }>

             <Icon as={ SiTelegram }
                   _hover={ { color: MAIN_COLOR_HOVER } }
                   boxSize={ "50px" }
                   color={ MAIN_COLOR }/>

          </Button>
       </HStack>

   );
}