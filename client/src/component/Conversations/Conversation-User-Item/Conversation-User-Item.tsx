import { IUserFromConversation } from "../../../interface";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { appActions, conversationAsyncActions } from "../../../store/slice";
import { Avatar, Heading, HStack } from "@chakra-ui/react";
import { getImageUrl } from "../../../helper";
import { ButtonIcon } from "../../UI";
import { FiUserMinus, RiVipCrownLine } from "react-icons/all";

export function ConversationUserItem( { user }: { user: IUserFromConversation } ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const kickUserFromGroupConversation = async ( userId: number ) => {
      const result = await dispatch(conversationAsyncActions.kickUserFromGroupConversation({
         userId, conversationId: activeConversation.id
      }));
      if (conversationAsyncActions.kickUserFromGroupConversation.rejected.match(result)) {
         dispatch(appActions.setActionMessage({ message: result.payload, type: "error" }));
      }
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