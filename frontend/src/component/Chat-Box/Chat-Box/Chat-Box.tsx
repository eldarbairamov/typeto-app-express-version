import { useEffect } from "react";

import { calc, HStack, VStack } from "@chakra-ui/react";
import { ChatBoxHeader } from "../Chat-Box-Header/Chat-Box-Header.tsx";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { messageAsyncActions } from "../../../store/slice/message.slice.ts";
import { MiniSideBar } from "../../SIde-Bar/Mini-Side-Bar/Mini-Side-Bar.tsx";
import { ChatBoxBottom } from "../Chat-Box-Bottom/Chat-Box-Bottom.tsx";
import { MessageList } from "../../Messages/Message-List/Message-List.tsx";
import { EmptyBox } from "../../Empty-Box/Empty-Box.tsx";

export function ChatBox() {
   const { activeConversation, conversations } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const getMessages = async ( conversationId: number ) => await dispatch(messageAsyncActions.getMessages({ conversationId }));

   useEffect(() => {
      if (activeConversation?.id) getMessages(activeConversation.id);
   }, [ activeConversation?.id ]);

   return (
       <HStack w={ [ "100%", "100%", "100%", "100%", calc("100%").subtract("400px").toString() ] }
               spacing={ 0 }
               justify={ "space-between" }
               h={ "100%" }>

          { Boolean(conversations.length) &&
              <>
                <MiniSideBar/>

                <VStack h={ "100%" }
                        borderRadius={ "0 20px 20px 0" }
                        w={ [
                           calc("100%").subtract("100px").toString(),
                           calc("100%").subtract("100px").toString(),
                           calc("100%").subtract("100px").toString(),
                           calc("100%").subtract("100px").toString(),
                           "100%",
                        ] }
                        bg={ "white" }
                        spacing={ 0 }>

                  <ChatBoxHeader/>

                  <VStack h={ calc("100%").subtract("60px").toString() }
                          w={ "100%" }
                          spacing={ 0 }>

                    <MessageList/>

                    <ChatBoxBottom/>

                  </VStack>

                </VStack>
              </>
          }

          { Boolean(!conversations.length) && <EmptyBox/> }

       </HStack>
   );
}