import { Avatar, AvatarBadge, AvatarGroup, Heading, HStack } from "@chakra-ui/react";
import { useAppSelector } from "../../../hook/redux.hook.ts";
import { v4 } from "uuid";
import { ChatBoxOptions } from "../Chat-Box-Options/Chat-Box-Options.tsx";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

export function ChatBoxHeader() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   return (
       <HStack width={ "100%" }
               h={ "60px" }
               spacing={ 0 }
               justify={ "center" }
               style={ { position: "relative" } }>

          <HStack spacing={ 3 }>

             { activeConversation.conversationName
                 ?
                 <AvatarGroup size="sm" max={ 2 }>
                    { activeConversation.users.map(user => <Avatar key={ v4() }
                                                                   name={ user.username }
                                                                   ignoreFallback={true}
                                                                   src={ getImageUrl(user.image, user.email) }
                                                                   size={ "lg" }> { onlineContactsIds.includes(user.id) &&
                        <AvatarBadge boxSize={ 3 } bg={ "green.500" }/> } </Avatar>) }
                 </AvatarGroup>
                 :
                 <Avatar name={ activeConversation.conversationWith[0].username }
                         ignoreFallback={true}
                         src={ getImageUrl(activeConversation.conversationWith[0].image, activeConversation.conversationWith[0].email) }
                         size={ "sm" }/>
             }
             <Heading size={ "md" }
                      color={ "gray.600" }>
                { activeConversation.conversationName ? activeConversation.conversationName : activeConversation.conversationWith[0].username }
             </Heading>

          </HStack>

          <ChatBoxOptions/>

       </HStack>

   );
}