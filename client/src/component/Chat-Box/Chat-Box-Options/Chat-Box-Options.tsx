import { v4 } from "uuid";
import { Divider, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, VStack } from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAppSelector } from "../../../hook";
import { MAIN_COLOR } from "../../../constant";
import { ConversationUserItem } from "../../../component";
import { conversationOptionsService } from "../../../service";

export function ChatBoxOptions() {
   const { activeConversation } = useAppSelector(state => state.conversationReducer);

   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const { deleteConversation, deleteGroupConversation, leaveGroupConversation } = conversationOptionsService(activeConversation);

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
                         color={ MAIN_COLOR }>

                      { (activeConversation.adminId === currentUserInfo.id || !activeConversation.isGroupConversation) ? "Завершити бесіду" : "Покинути бесіду" }

                   </Text>

                </MenuItem>

             </VStack>

          </MenuList>

       </Menu>
   );
}