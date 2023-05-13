import { Avatar, Button, Heading, HStack } from "@chakra-ui/react";
import { IUser } from "../../interface/user.interface.ts";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, AiOutlineUsergroupAdd, AiOutlineDelete } from "react-icons/all";
import { userService } from "../../service/user.service.ts";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { userActions } from "../../store/slice/user.slice.ts";
import { conversationService } from "../../service/conversation.service.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";

interface IUserItemProps {
   user: IUser,
   canDelete?: boolean,
   onModalClose?: () => void,
   isOnlyForAdding?: boolean
}

export function ContactItem( { user, canDelete, onModalClose, isOnlyForAdding }: IUserItemProps ) {
   const dispatch = useAppDispatch();

   const deleteContact = async () => {
      try {
         const { data } = await userService.deleteContact(user.id);
         dispatch(userActions.setContacts(data));
      } catch (e) {
         console.log(e);
      }
   };

   const createConversation = async () => {
      try {
         const { data } = await conversationService.createConversation([ user.id ]);
         dispatch(conversationActions.createConversation(data));

         dispatch(conversationActions.setActiveConversation({
            ...data,
            username: user.username
         }));

         onModalClose && onModalClose();

      } catch (e) {
         console.log(e);
      }
   };

   const addContactToGroup = () => {
      dispatch(conversationActions.addContactToGroup(user));
      dispatch(userActions.groupModeMove({ id: user.id, action: 'add' }));
   };

   return (
       <HStack w={ "85%" }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>

             <Avatar name={ user.username }
                     size={ "md" }/>

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
                         onClick={ deleteContact }
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