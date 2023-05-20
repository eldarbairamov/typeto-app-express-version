import { Button, Divider, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, FiUsers } from "react-icons/all";
import { MAIN_COLOR, MAIN_COLOR_HOVER3 } from "../../../constant/color.constant.ts";

interface IGroupConversationButtonProps {
   isGroup?: boolean;
   createGroupConversation?: () => void;
   openFriendList?: () => void;
   isNoBg?: boolean;
}

export function CreateConversationButton( { createGroupConversation, openFriendList, isGroup, isNoBg }: IGroupConversationButtonProps ) {
   return (
       <Button p={ 8 }
               variant={ isNoBg ? "ghost" : "solid" }
               rounded={ 20 }
               gap={ 5 }
               bg={ isNoBg ? "transparent" : "#eff0f3" }
               _hover={ { bg: isNoBg ? "transparent" : MAIN_COLOR_HOVER3 } }
               onClick={ isGroup ? createGroupConversation : openFriendList }>

          <Text color={ "gray.600" }
                fontSize={ 17 }>
             { isGroup ? "створити групову бесіду?" : "створити бесіду?" }
          </Text>

          <Divider orientation={ "horizontal" }
                   borderColor={ "gray.400" }
                   borderWidth={ 1 }
                   h={ 5 }/>

          <Icon as={ isGroup ? FiUsers : AiOutlineMessage }
                boxSize={ 30 }
                cursor={ "pointer" }
                color={ MAIN_COLOR }/>

       </Button>
   );
}