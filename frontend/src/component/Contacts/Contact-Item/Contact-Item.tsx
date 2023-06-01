import { Avatar, AvatarBadge, Button, Heading, HStack } from "@chakra-ui/react";
import { IUser } from "../../../interface/user.interface.ts";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, AiOutlineUsergroupAdd, AiOutlineDelete } from "react-icons/all";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { userActions, userAsyncActions } from "../../../store/slice/user.slice.ts";
import { conversationActions, conversationAsyncActions } from "../../../store/slice/conversation.slice.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

interface IUserItemProps {
   user: IUser,
   canDelete?: boolean,
   onModalClose?: () => void,
   isOnlyForAdding?: boolean
}

export function ContactItem( { user, canDelete, onModalClose, isOnlyForAdding }: IUserItemProps ) {
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);
   const { conversations } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const createConversation = async () => {
      const isConversationExists = conversations.find(c => {
         if (!c.isGroupConversation) {
            const targetId = c.conversationWith[0]?.id;
            if (user.id === targetId) return c;
         }
      });

      if (isConversationExists) {
         dispatch(conversationActions.setActiveConversation(isConversationExists));
         onModalClose && onModalClose();
      }

      const result = await dispatch(conversationAsyncActions.createConversation({
         userIds: [ user.id ],
         username: user.username
      }));

      if (conversationAsyncActions.createConversation.fulfilled.match(result)) {
         onModalClose && onModalClose();
      }
   };

   const addContactToGroup = () => {
      dispatch(conversationActions.addContactToGroup(user));
      dispatch(userActions.groupModeMove({ id: user.id, action: "add" }));
   };

   return (
       <HStack w={ "85%" }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>

             <Avatar name={ user.username }
                     ignoreFallback={ true }
                     src={ getImageUrl(user.image, user.email) }
                     size={ "md" }>

                { onlineContactsIds.includes(user.id)
                    &&
                    <AvatarBadge boxSize={ 5 }
                                 bg={ "green.500" }/>
                }

             </Avatar>

             <Heading size={ "md" }>
                { user.username }
             </Heading>

          </HStack>

          <HStack spacing={ 1 }>

             <Button variant={ "unstyled" }
                     display={ "flex" }
                     onClick={ isOnlyForAdding ? addContactToGroup : createConversation }
                     alignItems={ "center" }>

                <Icon as={ isOnlyForAdding ? AiOutlineUsergroupAdd : AiOutlineMessage }
                      boxSize={ isOnlyForAdding ? "29px" : "25px" }
                      color={ "gray.600" }/>

             </Button>

             { canDelete &&
                 <Button variant={ "unstyled" }
                         display={ "flex" }
                         onClick={ () => dispatch(userAsyncActions.deleteContact({ contactId: user.id })) }
                         alignItems={ "center" }>

                   <Icon as={ AiOutlineDelete }
                         boxSize={ "25px" }
                         color={ "gray.600" }/>

                 </Button>
             }

          </HStack>

       </HStack>
   );
}