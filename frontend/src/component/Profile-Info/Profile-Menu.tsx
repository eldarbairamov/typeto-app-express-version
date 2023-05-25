import { Avatar, Button, Divider, IconButton, Menu, MenuButton, MenuList, Text, VStack } from "@chakra-ui/react";
import { CgProfile } from "react-icons/all";
import { useAppSelector } from "../../hook/redux.hook.ts";
import { MAIN_COLOR } from "../../constant/color.constant.ts";

export function ProfileMenu() {
   const { currentUsername, avatar } = useAppSelector(state => state.authReducer);

   return (
       <Menu>
          <MenuButton _active={ { bg: "none" } }
                      _hover={ { bg: "none" } }
                      as={ IconButton }
                      mr={ 5 }
                      aria-label={ "Options" }
                      icon={ CgProfile({ color: MAIN_COLOR, size: 29 }) }/>

          <MenuList rounded={ 20 }
                    boxShadow={ "xl" }>
             <VStack w={ "100%" }
                     h={ "100%" }
                     p={ 5 }
                     spacing={ 5 }>

                <VStack spacing={ 5 }>
                   <Avatar name={ currentUsername } src={ avatar } size={ "lg" }/>
                   <Text fontWeight={ "black" } fontSize={ 15 }> { currentUsername } </Text>
                </VStack>

                <Divider/>

                <Button w={ "100%" }
                        variant={ "ghost" }
                        fontWeight={ "normal" }>
                   Змінити фото
                </Button>

             </VStack>
          </MenuList>
       </Menu>
   );
}