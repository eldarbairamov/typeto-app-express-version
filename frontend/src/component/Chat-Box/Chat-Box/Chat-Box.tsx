import { useAppSelector } from "../../../hook";
import { getMessageService } from "../../../service";
import { calc, HStack, VStack } from "@chakra-ui/react";
import { EmptyBox, MessageList, MiniSideBar, ChatBoxBottom, ChatBoxHeader } from "../../../component";

export function ChatBox() {
   const { activeConversation, conversations } = useAppSelector(state => state.conversationReducer);

   getMessageService(activeConversation);

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