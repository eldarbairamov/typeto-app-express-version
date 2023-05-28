import { Avatar, Heading, HStack } from "@chakra-ui/react";
import { ButtonIcon } from "../../UI/Button-Icon/Button-Icon.tsx";
import { FiUserMinus, RiVipCrownLine } from "react-icons/all";
import { IUserFromConversation } from "../../../interface/user.interface.ts";
import { useAppSelector } from "../../../hook/redux.hook.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

export function ConversationUserItem( { user }: { user: IUserFromConversation } ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   return (
       <HStack justify={ "space-between" }
               w={ activeConversation.isGroupConversation ? 250 : undefined }>

          <HStack w={ "100%" }
                  spacing={ 4 }>

             <Avatar name={ user.username }
                     src={ getImageUrl(user.image, user.email) }
                     size={ "sm" }/>

             <Heading size={ "sm" }> { user.username } </Heading>

          </HStack>

          <ButtonIcon size={ 6 }
                      cursor={ activeConversation.adminId === user.id ? "default" : "pointer" }
                      as={ activeConversation.adminId === user.id ? RiVipCrownLine : FiUserMinus }/>

       </HStack>
   );
}