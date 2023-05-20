import { useState } from "react";

import { Box, calc, Center, useDisclosure, VStack } from "@chakra-ui/react";
import { SearchBar } from "../Search-Bar/Search-Bar.tsx";
import { useAppSelector } from "../../hook/redux.hook.ts";
import { Conversation } from "../Conversation/Conversation.tsx";
import { GroupConversationMenu } from "../Group-Conversation-Menu/Group-Conversation-Menu.tsx";
import { ConversationList } from "../Conversation-List/Conversation-List.tsx";
import { CreateConversationButton } from "../UI/Create-Conversation-Button/Create-Conversation-Button.tsx";
import { AppModal } from "../UI/App-Modal/App-Modal.tsx";

export function SideBar() {
   const { conversations } = useAppSelector(state => state.conversationReducer);

   const [ content, setContent ] = useState<JSX.Element>();

   const { isOpen, onOpen, onClose } = useDisclosure();

   const createGroupConversation = () => {
      setContent(<GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   return (
       <VStack bg={ "white" }
               h={ "100%" }
               borderRight={ "1px" }
               borderColor={ "gray.100" }
               spacing={ 0 }
               borderRadius={ "20px 0 0 20px" }
               w={ "400px" }
               display={ [ "none", "none", "none", "none", "flex" ] }>

          <SearchBar/>

          <Box p={ "20px 20px 0 20px" }
               alignItems={ "flex-start" }
               w={ "100%" }
               h={ calc("100%").subtract("160px").toString() }>

             <ConversationList Conversation={ Conversation }/>

          </Box>

          { Boolean(conversations.length) &&
              <>
                <Center h={ "100px" }>

                  <CreateConversationButton isGroup={ true }
                                            isNoBg={ true }
                                            createGroupConversation={ createGroupConversation }/>

                </Center>
              </>
          }

          <AppModal isOpen={ isOpen } onClose={ onClose } content={ content }/>

       </VStack>
   );
}