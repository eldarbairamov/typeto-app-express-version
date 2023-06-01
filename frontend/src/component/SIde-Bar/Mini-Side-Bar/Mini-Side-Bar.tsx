import { useState } from "react";

import { Box, calc, Center, useDisclosure, VStack } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { MiniConversation } from "../../Conversations/Mini-Conversation/Mini-Conversation.tsx";
import { FiUsers } from "react-icons/all";
import { GroupConversationMenu } from "../../Group-Conversation-Menu/Group-Conversation-Menu.tsx";
import { AppModal } from "../../UI/App-Modal/App-Modal.tsx";
import { ConversationList } from "../../Conversations/Conversation-List/Conversation-List.tsx";
import { ButtonIcon } from "../../UI/Button-Icon/Button-Icon.tsx";
import { MAIN_COLOR } from "../../../constant/color.constant.ts";

export function MiniSideBar() {

   const createGroupConversation = () => {
      setContent(<GroupConversationMenu isOnlyMessage={ true } onModalClose={ onClose }/>);
      onOpen();
   };

   const [ content, setContent ] = useState<JSX.Element>();

   const { isOpen, onOpen, onClose } = useDisclosure();

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