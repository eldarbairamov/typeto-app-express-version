import { Box, Button, calc, Divider, Modal, ModalContent, ModalOverlay, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { SearchBar } from "../Search-Bar/Search-Bar.tsx";
import { useAppSelector } from "../../hook/redux.hook.ts";
import { Conversation } from "../Conversation/Conversation.tsx";
import { v4 } from "uuid";
import { Icon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/all";
import { GroupConversationMenu } from "../Group-Conversation-Menu/Group-Conversation-Menu.tsx";
import { useState } from "react";

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
               h={ calc("100vh").subtract("150px").toString() }
               spacing={ 0 }
               rounded={ 20 }>

          <SearchBar/>

          <Divider/>

          <Box
              p={ "20px 20px 0 20px" }
              alignItems={ "flex-start" }
              h={ calc("100%").subtract("60px").toString() }
              w={ "400px" }>

             <VStack overflow={ "scroll" }
                     h={ "100%" }
                     spacing={ 0 }>

                { Boolean(conversations.length) && conversations.map(conversation => {
                   if (conversation.isGroupConversation) {
                      return <Conversation key={ v4() } conversation={ conversation }/>;
                   }
                   return conversation.conversationWith.map(user => <Conversation key={ v4() } user={ user } conversation={ conversation }/>);
                }) }

             </VStack>


          </Box>

          { Boolean(conversations.length) &&
              <>
                  <Divider/>

                  <Box p={ 2 }>
                      <Button p={ 8 }
                              variant={ 'ghost' }
                              rounded={ 20 }
                              gap={ 5 }
                              _hover={ { bg: "transparent" } }
                              onClick={ createGroupConversation }>

                          <Text color={ "gray.600" }
                                fontSize={ 17 }>
                              створити групову бесіду?
                          </Text>

                          <Divider orientation={ 'horizontal' }
                                   borderColor={ 'gray.400' }
                                   borderWidth={ 1 }
                                   h={ 5 }/>

                          <Icon as={ FiUsers }
                                boxSize={ 30 }
                                cursor={ 'pointer' }
                                color={ 'orange.400' }/>

                      </Button>
                  </Box>
              </>
          }


          <Modal isOpen={ isOpen }
                 onClose={ onClose }
                 isCentered={ true }
                 motionPreset={ "slideInBottom" }>

             <ModalOverlay bg={ "blackAlpha.200" }
                           backdropFilter={ "auto" }
                           backdropBlur={ "5px" }/>

             <ModalContent w={ 400 }
                           p={ 2 }
                           rounded={ 20 }>
                { content }
             </ModalContent>

          </Modal>

       </VStack>
   );
}