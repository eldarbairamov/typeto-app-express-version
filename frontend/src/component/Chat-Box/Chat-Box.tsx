import { useEffect } from "react";

import { Box, Button, calc, Divider, HStack, Textarea, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { SiTelegram } from "react-icons/all";
import { ChatBoxHeader } from "../Chat-Box-Header/Chat-Box-Header.tsx";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { messageAsyncActions } from "../../store/slice/message.slice.ts";
import { OutcomingMessage } from "../Outcoming-Message/Outcoming-Message.tsx";
import { IncomingMessage } from "../Incoming-Message/Incoming-Message.tsx";
import { v4 } from "uuid";

export function ChatBox() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { currentUserInfo } = useAppSelector(state => state.authReducer);
   const { messages } = useAppSelector(state => state.messageReducer);

   const dispatch = useAppDispatch();

   const getMessages = async () => {
      const result = await dispatch(messageAsyncActions.getMessages({ conversationId: activeConversation.id }));
      if (messageAsyncActions.getMessages.fulfilled.match(result)) {
         console.log(result.payload);
      }
      if (messageAsyncActions.getMessages.rejected.match(result)) {
         console.log(result.payload);
      }
   };

   useEffect(() => {
      getMessages();
   }, [ activeConversation.id ]);

   return (
       <VStack h={ calc("100vh").subtract("150px").toString() }
               rounded={ 20 }
               bg={ "white" }
               w={ calc("100%").subtract("450px").toString() }
               spacing={ 0 }>

          <ChatBoxHeader/>

          <Divider/>

          <VStack h={ calc("100%").subtract("60px").toString() }
                  w={ "100%" }
                  spacing={ 0 }>

             <VStack h={ calc("100%").subtract("100px").toString() }
                     spacing={ 0 }
                     p={ "20px 20px 0 20px" }
                     overflow={ "scroll" }
                     w={ "100%" }>

                { messages.map(message => {
                   if (message.sender.id === currentUserInfo.userId) {
                      return <OutcomingMessage key={ v4() } message={ message }/>;
                   }
                   if (message.sender.id !== currentUserInfo.userId) {
                      return <IncomingMessage key={ v4() } message={ message }/>;
                   }
                }) }

             </VStack>

             <Divider/>

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
                             focusBorderColor={ "transparent" }
                             placeholder={ "Написати..." }/>

                </Box>

                <Button bg={ "transparent" }
                        height={ "50px" }
                        color={ "white" }
                        _hover={ { bg: "transparent" } }>

                   <Icon as={ SiTelegram }
                         _hover={ { color: "orange.500" } }
                         boxSize={ "50px" }
                         color={ "orange.400" }/>

                </Button>
             </HStack>

          </VStack>
       </VStack>
   );
}