import { useState } from "react";

import { Box, calc, Center, useDisclosure, VStack } from "@chakra-ui/react";
import { SearchBar } from "../Search-Bar/Search-Bar.tsx";
import { ConversationItem } from "../../Conversations/Conversation-Item/Conversation-Item.tsx";
import { GroupConversationMenu } from "../../Chat-Box/Group-Conversation-Menu/Group-Conversation-Menu.tsx";
import { ConversationList } from "../../Conversations/Conversation-List/Conversation-List.tsx";
import { CreateConversationButton } from "../../UI/Create-Conversation-Button/Create-Conversation-Button.tsx";
import { AppModal } from "../../UI/App-Modal/App-Modal.tsx";

export function SideBar() {
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

             <ConversationList Conversation={ ConversationItem }/>

          </Box>


          <Center h={ "100px" }>
             <CreateConversationButton isGroup={ true }
                                       isNoBg={ true }
                                       createGroupConversation={ createGroupConversation }/>
          </Center>


          <AppModal isOpen={ isOpen } onClose={ onClose } content={ content }/>

       </VStack>
   );
}