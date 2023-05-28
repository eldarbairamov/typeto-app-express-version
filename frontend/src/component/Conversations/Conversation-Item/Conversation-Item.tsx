import { Avatar, AvatarBadge, AvatarGroup, Badge, Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { IUserFromConversation } from "../../../interface/user.interface.ts";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { conversationActions } from "../../../store/slice/conversation.slice.ts";
import { IConversation } from "../../../interface/conversation.interface.ts";
import moment from "moment";
import { v4 } from "uuid";
import { CONVERSATION_ACTIVE_COLOR } from "../../../constant/color.constant.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

export function ConversationItem( { user, conversation }: IConversationProps ) {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { onlineContactsIds } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const selectConversation = () => {
      dispatch(conversationActions.setActiveConversation({
         ...conversation,
         username: user?.username
      }));
   };

   const conversationTime = moment(+conversation.lastModified).format("HH:mm");

   return (
       <VStack width={ "100%" }>

          <VStack width={ "100%" }
                  bg={ conversation.id === activeConversation.id ? CONVERSATION_ACTIVE_COLOR : undefined }
                  p={ 4 }
                  rounded={ 10 }
                  justify={ "center" }
                  h={ "80px" }
                  spacing={ 5 }
                  onClick={ selectConversation }
                  cursor={ "pointer" }>

             <HStack w={ "100%" }
                     justify={ "space-between" }>

                <HStack spacing={ 5 }>

                   { conversation.isGroupConversation &&
                       <AvatarGroup size={ "md" }
                                    max={ 2 }>
                          { conversation.users.map(user =>
                              <Avatar key={ v4() }
                                      name={ user.username }
                                      src={ getImageUrl(user.image, user.email) }
                                      ignoreFallback={ true }
                                      size={ "lg" }>
                                 { onlineContactsIds.includes(user.id) && <AvatarBadge boxSize={ 4 }
                                                                                       bg={ "green.500" }/> }
                              </Avatar>) }
                       </AvatarGroup>
                   }

                   { user &&
                       <Avatar name={ user?.username }
                               src={ getImageUrl(user.image, user.email) }
                               ignoreFallback={ true }
                               size={ "lg" }>
                          { onlineContactsIds.includes(user.id) && <AvatarBadge boxSize={ 5 }
                                                                                bg={ "green.500" }/> }
                       </Avatar>
                   }

                   <VStack alignItems={ "flex-start" }
                           h={ "100%" }
                           justify={ "center" }>

                      <Heading size={ "sm" }
                               color={ conversation.id === activeConversation.id ? "white" : "default" }>
                         { conversation.isGroupConversation ? conversation.conversationName : user?.username }
                      </Heading>

                      <Text color={ conversation.id === activeConversation.id ? "gray.200" : "gray.500" } noOfLines={ 1 }>
                         { conversation.lastMessage?.content ? conversation.lastMessage.content : "" }
                      </Text>

                   </VStack>

                </HStack>

                <VStack h={ "100%" } justify={ "space-between" }>
                   <Text color={ conversation.id === activeConversation.id ? "white" : "default" }>
                      { conversationTime }
                   </Text>

                   { conversation.isNewMessagesExist &&
                       <Badge bg={ "cyan.100" }
                              fontSize={ 13 }
                              w={ 1 }
                              h={ 4 }
                              px={ 2 }
                              rounded={ 20 }>
                       </Badge>
                   }
                </VStack>

             </HStack>

          </VStack>

          <Divider width={ 300 }/>

       </VStack>
   );
}