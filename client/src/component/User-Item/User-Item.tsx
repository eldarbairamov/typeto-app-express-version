import { Avatar, Button, Heading, HStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, FiUserPlus, FiUserCheck } from "react-icons/all";
import { useState } from "react";
import { IUserBySearch } from "../../interface";
import { addContactService, createConversationService } from "../../service";
import { getImageUrl } from "../../helper";

interface IUserItemProps {
   user: IUserBySearch,
   onModalClose: () => void
}

export function UserItem( { user, onModalClose }: IUserItemProps ) {
   const [ isAdded, setIsAdded ] = useState<boolean>(user.isAlreadyAdded);

   const { addContact } = addContactService(user, setIsAdded);

   const { createConversation } = createConversationService(user, onModalClose);

   return (
       <HStack w={ "85%" }
               spacing={ 5 }
               justify={ "space-between" }>

          <HStack spacing={ 5 }>

             <Avatar name={ user.username }
                     src={ getImageUrl(user.image, user.email) }
                     ignoreFallback={ true }
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
                     cursor={ isAdded ? "default" : "pointer" }
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