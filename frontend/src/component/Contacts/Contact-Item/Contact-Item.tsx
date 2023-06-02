import { Avatar, AvatarBadge, Button, Heading, HStack } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { IUser } from "../../../interface";
import { createConversationService } from "../../../service";
import { conversationActions, userActions, userAsyncActions } from "../../../store/slice";
import { getImageUrl } from "../../../helper";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineDelete, AiOutlineMessage, AiOutlineUsergroupAdd } from "react-icons/all";

interface IUserItemProps {
   user: IUser,
   canDelete?: boolean,
   onModalClose?: () => void,
   isOnlyForAdding?: boolean
}

export function ContactItem( { user, canDelete, onModalClose, isOnlyForAdding }: IUserItemProps ) {
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const { createConversation } = createConversationService(user, onModalClose);

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

                { onlineContactsIds.includes(user.id) &&
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