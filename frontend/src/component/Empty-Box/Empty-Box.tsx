import { useState } from "react";

import { VStack, Center, useDisclosure, Divider } from "@chakra-ui/react";
import { ContactList } from "../Contact-List/Contact-List.tsx";
import { GroupConversationMenu } from "../Group-Conversation-Menu/Group-Conversation-Menu.tsx";
import { AppModal } from "../UI/App-Modal/App-Modal.tsx";
import { CreateConversationButton } from "../UI/Create-Conversation-Button/Create-Conversation-Button.tsx";

export function EmptyBox() {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const openFriendList = () => {
      setContent(<ContactList isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   const createGroupConversation = () => {
      setContent(<GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   return (
       <VStack h={ "100%" }
               rounded={ 20 }
               bg={ "white" }
               w={ "100%" }
               spacing={ 0 }>

          <Center h={ "100%" }
                  flexDir={ "column" }
                  gap={ 5 }>

             <CreateConversationButton isGroup={ false }
                                       openFriendList={ openFriendList }/>

             <Divider w={ 60 }/>

             <CreateConversationButton isGroup={ true }
                                       createGroupConversation={ createGroupConversation }/>

          </Center>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }/>

       </VStack>
   );
}