import { Avatar, AvatarBadge, Button, Heading, HStack } from "@chakra-ui/react";
import { IUser } from "../../interface/user.interface.ts";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, AiOutlineUsergroupAdd, AiOutlineDelete } from "react-icons/all";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { userActions, userAsyncActions } from "../../store/slice/user.slice.ts";
import { conversationActions, conversationAsyncActions } from "../../store/slice/conversation.slice.ts";

interface IUserItemProps {
   user: IUser,
   canDelete?: boolean,
   onModalClose?: () => void,
   isOnlyForAdding?: boolean
}

export function ContactItem( { user, canDelete, onModalClose, isOnlyForAdding }: IUserItemProps ) {
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const createConversation = async () => {
      const result = await dispatch(conversationAsyncActions.createConversation({ userIds: [ user.id ], username: user.username }));
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
                     size={ "md" }>
                { onlineContactsIds.includes(user.id) && <AvatarBadge boxSize={ 5 } bg={ "green.500" }/> }
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