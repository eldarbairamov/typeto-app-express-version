import { v4 } from "uuid";

import { Divider, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { MAIN_COLOR } from "../../../constant/color.constant.ts";
import { conversationAsyncActions } from "../../../store/slice/conversation.slice.ts";
import { useAppDispatch, useAppSelector } from "../../../hook/redux.hook.ts";
import { ConversationUserItem } from "../../Conversations/Conversation-User-Item/Conversation-User-Item.tsx";

export function ChatBoxOptions() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const deleteConversation = async () => {
      dispatch(conversationAsyncActions.deleteConversation({ conversation: activeConversation }));
   };

   const leaveGroupConversation = async () => {
      dispatch(conversationAsyncActions.leaveGroupConversation({ conversation: activeConversation }));
   };

   const deleteGroupConversation = async () => {
      dispatch(conversationAsyncActions.deleteGroupConversation({ conversation: activeConversation }));
   };

   return (
       <Menu autoSelect={ false }>

          <MenuButton style={ { position: "absolute", right: 30 } }
                      as={ IconButton }
                      _active={ { bg: "#eff0f3" } }
                      _hover={ { bg: "#eff0f3" } }
                      p={ 1 }
                      border={ "none" }
                      icon={ <HamburgerIcon boxSize={ 5 } color={ MAIN_COLOR }/> }
                      variant={ "outline" }/>

          <MenuList rounded={ 20 }
                    p={ 3 }>

             <VStack w={ "100%" }>

                { activeConversation.isGroupConversation &&
                    <>
                      <VStack p={ 5 }
                              spacing={ 5 }>

                         { activeConversation.users && activeConversation?.users.map(item =>
                             <ConversationUserItem key={ v4() }
                                                   user={ item }/>
                         ) }

                      </VStack>

                      <Divider/>
                    </>
                }

                <MenuItem rounded={ 5 }
                          _hover={ { bg: "#eff0f3" } }
                          onClick={
                             activeConversation.adminId === currentUserInfo.id ? deleteGroupConversation :
                                 activeConversation.isGroupConversation ? leaveGroupConversation : deleteConversation }
                          p={ 2 }>

                   <Text w={ "100%" }
                         textAlign={ "center" }
                         fontWeight={ "bold" }
                         color={ MAIN_COLOR }
                         onClick={
                            activeConversation.adminId === currentUserInfo.id ? deleteGroupConversation :
                                activeConversation.isGroupConversation ? leaveGroupConversation : deleteConversation }>

                      { (activeConversation.adminId === currentUserInfo.id || !activeConversation.isGroupConversation) ? "Завершити бесіду" : "Покинути бесіду" }

                   </Text>

                </MenuItem>

             </VStack>

          </MenuList>

       </Menu>
   );
}