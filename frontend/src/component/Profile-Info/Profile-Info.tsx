import { useRef } from "react";

import { Avatar, Button, Divider, IconButton, Input, Menu, MenuButton, MenuList, Text, VStack } from "@chakra-ui/react";
import { CgProfile } from "react-icons/all";
import { useAppSelector } from "../../hook";
import { MAIN_COLOR } from "../../constant";
import { getImageUrl } from "../../helper";
import { avatarService } from "../../service";

export function ProfileInfo() {
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const { deleteAvatar, uploadAvatar } = avatarService();

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

                   <Avatar name={ currentUserInfo.username }
                           src={ getImageUrl(currentUserInfo.image, currentUserInfo.email) }
                           size={ "2xl" }/>

                   <Text fontWeight={ "black" }
                         fontSize={ 15 }>
                      { currentUserInfo.username }
                   </Text>

                </VStack>

                <Divider/>

                <VStack w={ "100%" }>

                   <Button w={ "100%" }
                           variant={ "ghost" }
                           onClick={ handlePick }
                           fontWeight={ "normal" }>
                      Змінити фото
                   </Button>

                   <Button w={ "100%" }
                           variant={ "ghost" }
                           color={ MAIN_COLOR }
                           onClick={ deleteAvatar }
                           fontWeight={ "normal" }>
                      Видалити
                   </Button>

                </VStack>

                <Input type={ "file" }
                       display={ "none" }
                       ref={ ref }
                       onChange={ uploadAvatar }/>

             </VStack>

          </MenuList>

       </Menu>
   );
}