import { Avatar, AvatarBadge, AvatarGroup, Box, Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { IUserFromConversation } from "../../interface/user.interface.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { IConversation } from "../../interface/conversation.interface.ts";
import moment from "moment";
import { v4 } from "uuid";
import { MAIN_COLOR_ACTIVE, MAIN_COLOR_HOVER2 } from "../../constant/color.constant.ts";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

export function Conversation( { user, conversation }: IConversationProps ) {
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
                  _hover={ { bg: conversation.id === activeConversation.id ? MAIN_COLOR_ACTIVE : MAIN_COLOR_HOVER2, transition: ".3s" } }
                  bg={ conversation.id === activeConversation.id ? MAIN_COLOR_ACTIVE : undefined }
                  p={ 4 }
                  rounded={ 10 }
                  spacing={ 5 }
                  onClick={ selectConversation }
                  cursor={ "pointer" }>

             <HStack w={ "100%" }
                     justify={ "space-between" }>

                <HStack spacing={ 5 }>

                   { conversation.isGroupConversation &&
                       <AvatarGroup size="md" max={ 2 }>
                          { conversation.users.map(user =>
                              <Avatar key={ v4() } name={ user.username } size={ "lg" }>
                                 { onlineContactsIds.includes(user.id) && <AvatarBadge boxSize={ 4 } bg={ "green.500" }/> }
                              </Avatar>) }
                       </AvatarGroup>
                   }

                   { user &&
                       <Avatar name={ user?.username }
                               size={ "lg" }>
                          { onlineContactsIds.includes(user.id) && <AvatarBadge boxSize={ 5 } bg={ "green.500" }/> }
                       </Avatar>
                   }

                   <VStack alignItems={ "flex-start" }
                           h={ "100%" }
                           justify={ "center" }>

                      <Heading size={ "sm" }> { conversation.isGroupConversation ? conversation.conversationName : user?.username } </Heading>

                      <Text color={ "gray.500" } noOfLines={ 1 }>
                         { conversation.lastMessage?.content ? conversation.lastMessage.content : "" }
                      </Text>

                   </VStack>

                </HStack>

                <Box h={ "100%" }>
                   <Text>
                      { conversationTime }
                   </Text>
                </Box>

             </HStack>

          </VStack>

          <Divider width={ 300 }/>

       </VStack>
   );
}