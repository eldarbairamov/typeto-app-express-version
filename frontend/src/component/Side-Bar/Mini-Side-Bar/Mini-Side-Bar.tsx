import { useState } from "react";

import { Box, calc, Center, useDisclosure, VStack } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { FiUsers } from "react-icons/all";
import { MAIN_COLOR } from "../../../constant";
import { ConversationList, MiniConversation, AppModal, ButtonIcon, GroupConversationMenu } from "../../../component";

export function MiniSideBar() {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const createGroupConversation = () => {
      setContent(<GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   return (
       <VStack display={ [ "initial", "initial", "initial", "initial", "none" ] }
               borderRadius={ "20px 0 0 20px" }
               borderRight={ "1px" }
               borderColor={ "gray.100" }
               spacing={ 0 }
               bg={ "white" }
               w={ "100px" }
               h={ "100%" }>

          <Center h={ "60px" }>
             <ButtonIcon size={ 5 } as={ Search2Icon } color={ MAIN_COLOR }/>
          </Center>

          <Box p={ "20px 20px 0 20px" }
               h={ calc("100%").subtract("160px").toString() }
               alignItems={ "flex-start" }
               w={ "100%" }>

             <ConversationList Conversation={ MiniConversation }/>

          </Box>

          <Center h={ "100px" }>
             <ButtonIcon size={ 30 }
                         as={ FiUsers }
                         color={ MAIN_COLOR }
                         fn={ createGroupConversation }/>
          </Center>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }/>

       </VStack>
   );
}