import { useState } from "react";

import { Highlight, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { BiSearch, IoMdLogOut, FiUsers } from "react-icons/all";
import { logoutService } from "../../service";
import { MAIN_COLOR } from "../../constant";
import { AppModal, ButtonIcon, ProfileInfo, FindUser, ContactList } from "../../component";

export function Header() {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [ content, setContent ] = useState<JSX.Element>();

   const openFindUsers = () => {
      setContent(<FindUser onModalClose={ onClose }/>);
      onOpen();
   };

   const openFriendList = () => {
      setContent(<ContactList onModalClose={ onClose }/>);
      onOpen();
   };

   const { logout } = logoutService();

   return (
       <HStack w={ "95%" }
               spacing={ 0 }
               paddingTop={ 5 }
               alignItems={ "flex-start" }
               justify={ "space-between" }
               h={ "100px" }>

          <Text cursor={ "default" }
                ml={ 5 }
                fontWeight={ "bold" }
                fontSize={ 30 }>

             <Highlight query={ "to" }
                        styles={ {
                           color: "white",
                           p: "5px 10px",
                           borderRadius: "10px 0 10px 10px",
                           bg: MAIN_COLOR
                        } }>
                typeto
             </Highlight>

          </Text>

          <HStack spacing={ 0 }>

             <ProfileInfo/>

             <ButtonIcon size={ 8 }
                         as={ FiUsers }
                         rounded={ 5 }
                         color={ "gray.600" }
                         p={ 5 }
                         fn={ openFriendList }/>

             <ButtonIcon size={ 8 }
                         as={ BiSearch }
                         rounded={ 5 }
                         color={ "gray.600" }
                         p={ 5 }
                         fn={ openFindUsers }/>

             <ButtonIcon size={ 8 }
                         as={ IoMdLogOut }
                         rounded={ 5 }
                         color={ "gray.600" }
                         p={ 5 }
                         fn={ logout }/>
          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }/>

       </HStack>
   );
}