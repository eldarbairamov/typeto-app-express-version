import { Avatar, Button, Heading, HStack } from "@chakra-ui/react";
import { IUserBySearch } from "../../interface/user.interface.ts";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, FiUserPlus, FiUserCheck } from "react-icons/all";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { conversationAsyncActions } from "../../store/slice/conversation.slice.ts";
import { useState } from "react";
import { userAsyncActions } from "../../store/slice/user.slice.ts";

interface IUserItemProps {
   user: IUserBySearch,
   onModalClose: () => void
}

export function UserItem( { user, onModalClose }: IUserItemProps ) {
   const [ isAdded, setIsAdded ] = useState<boolean>(user.isAlreadyAdded);

   const dispatch = useAppDispatch();

   const addContact = async () => {
      const result = await dispatch(userAsyncActions.addContact({ contactId: user.id }));
      if (userAsyncActions.addContact.fulfilled.match(result)) {
         setIsAdded(true);
      }
   };

   const createConversation = async () => {
      const result = await dispatch(conversationAsyncActions.createConversation({ userIds: [ user.id ] }));
      if (conversationAsyncActions.createConversation.fulfilled.match(result)) {
         onModalClose();
      }
   };


   return (
       <HStack w={ "85%" }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>
             <Avatar name={ user.username }
                     size={ "md" }/>
             <Heading size={ "md" }> { user.username } </Heading>
          </HStack>

          <HStack spacing={ 1 }>

             <Button variant={ "unstyled" }
                     display={ "flex" }
                     onClick={ createConversation }
                     alignItems={ "center" }>
                <Icon as={ AiOutlineMessage }
                      boxSize={ "25px" }
                      color={ "gray.600" }/>
             </Button>

             <Button variant={ "unstyled" }
                     cursor={ isAdded ? 'default' : 'pointer' }
                     display={ "flex" }
                     onClick={ isAdded ? undefined : addContact }
                     alignItems={ "center" }>
                <Icon as={ isAdded ? FiUserCheck : FiUserPlus }
                      boxSize={ "25px" }
                      color={ "gray.600" }/>
             </Button>

          </HStack>

       </HStack>
   );
}