import { useState } from "react";

import { Box, calc, Center, useDisclosure, VStack } from "@chakra-ui/react";
import { SearchBar } from "../Search-Bar/Search-Bar.tsx";
import { ConversationItem, ConversationList, AppModal, CreateConversationButton, GroupConversationMenu } from "../../../component";
import { useAppDispatch, useObserver } from "../../../hook";
import { conversationActions } from "../../../store/slice";

export function SideBar() {
   const [ content, setContent ] = useState<JSX.Element>();

   const { isOpen, onOpen, onClose } = useDisclosure();

   const createGroupConversation = () => {
      setContent(<GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   const dispatch = useAppDispatch();

   const { lastElemRef } = useObserver(() => {
      dispatch(conversationActions.limitIncrease())
   });

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

          <Box p={ "0 20px 0 20px" }
               alignItems={ "flex-start" }
               w={ "100%" }
               h={ calc("100%").subtract("160px").toString() }>

             <ConversationList Conversation={ ConversationItem } ref={ lastElemRef }/>
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