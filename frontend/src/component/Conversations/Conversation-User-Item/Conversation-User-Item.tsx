import { Avatar, Heading, HStack } from "@chakra-ui/react";
import { ButtonIcon } from "../../UI/Button-Icon/Button-Icon.tsx";
import { FiUserMinus, RiVipCrownLine } from "react-icons/all";
import { IUserFromConversation } from "../../../interface/user.interface.ts";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";
import { conversationAsyncActions } from "../../../store/slice/conversation.slice.ts";

export function ConversationUserItem( { user }: { user: IUserFromConversation } ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const kickUserFromGroupConversation = async ( userId: number ) => {
      dispatch(conversationAsyncActions.kickUserFromGroupConversation({ userId, conversationId: activeConversation.id }));
   };

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

          {
             activeConversation.adminId === currentUserInfo.id
                 ? <ButtonIcon size={ 6 }
                               cursor={ activeConversation.adminId === user.id ? "default" : "pointer" }
                               fn={ activeConversation.adminId !== user.id ? () => kickUserFromGroupConversation(user.id) : undefined }
                               as={ activeConversation.adminId === user.id ? RiVipCrownLine : FiUserMinus }/>

                 : <ButtonIcon size={ 6 }
                               cursor={ "default" }
                               as={ activeConversation.adminId === user.id ? RiVipCrownLine : undefined }/>
          }


       </HStack>
   );
}