import { Avatar, AvatarBadge, AvatarGroup, Center, Divider, VStack } from "@chakra-ui/react";
import { IUserFromConversation } from "../../../interface/user.interface.ts";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { conversationActions } from "../../../store/slice/conversation.slice.ts";
import { IConversation } from "../../../interface/conversation.interface.ts";
import { v4 } from "uuid";
import { CONVERSATION_ACTIVE_COLOR } from "../../../constant/color.constant.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

export function MiniConversation( { user, conversation }: IConversationProps ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const selectConversation = () => {
      dispatch(conversationActions.setActiveConversation({
         ...conversation,
         username: user?.username
      }));
   };

   return (
       <VStack width={ "100%" }>

          <Center p={ 4 }
                  bg={ conversation.id === activeConversation.id ? CONVERSATION_ACTIVE_COLOR : undefined }
                  w={ "100%" }
                  rounded={ 10 }
                  onClick={ selectConversation }
                  cursor={ "pointer" }>

             { conversation.isGroupConversation &&
                 <AvatarGroup size={ "sm" }
                              max={ 1 }>

                    { conversation.users.map(user =>
                        <Avatar key={ v4() }
                                src={ getImageUrl(user.image, user.email) }
                                ignoreFallback={ true }
                                name={ user.username }
                                size={ "md" }>

                           { onlineContactsIds.includes(user.id)
                               && <AvatarBadge boxSize={ 4 }
                                               bg={ "green.500" }/>
                           }

                        </Avatar>)
                    }
                 </AvatarGroup>
             }

             { user &&
                 <Avatar name={ user?.username }
                         src={ getImageUrl(user.image, user.email) }
                         ignoreFallback={ true }
                         size={ "md" }>

                    { onlineContactsIds.includes(user.id)
                        && <AvatarBadge boxSize={ 4 }
                                        bg={ "green.500" }/>
                    }

                 </Avatar>
             }

          </Center>

          <Divider width={ 50 }/>

       </VStack>
   );
}