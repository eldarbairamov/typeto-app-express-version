import { Highlight, HStack, Modal, ModalContent, ModalOverlay, Text, useDisclosure } from "@chakra-ui/react";
import { BiSearch, IoMdLogOut, FiUsers } from "react-icons/all";
import { useState } from "react";
import { FindUser } from "../Find-User/Find-User.tsx";
import { ContactList } from "../Contact-List/Contact-List.tsx";
import { ButtonIcon } from "../UI/Button-Icon/Button-Icon.tsx";
import { MAIN_COLOR } from "../../constant/color.constant.ts";

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

   return (
       <HStack w={ "95%" }
               spacing={ 0 }
               paddingTop={ 5 }
               alignItems={ "flex-start" }
               justify={ "space-between" }
               h={ "100px" }>

          <Text cursor={ "default" }
                fontWeight={ "bold" }
                fontSize={ 30 }>
             <Highlight query={ "to" }
                        styles={ { color: "white", p: "2px 10px", rounded: "lg", bg: MAIN_COLOR } }>
                typeto
             </Highlight>
          </Text>

          <HStack spacing={ 0 }>

             <ButtonIcon size={ 8 } as={ FiUsers } rounded={ 5 } color={ MAIN_COLOR } p={ 5 } fn={ openFriendList }/>
             <ButtonIcon size={ 8 } as={ BiSearch } rounded={ 5 } color={ MAIN_COLOR } p={ 5 } fn={ openFindUsers }/>
             <ButtonIcon size={ 8 } as={ IoMdLogOut } rounded={ 5 } color={ MAIN_COLOR } p={ 5 }/>

          </HStack>

          <Modal isOpen={ isOpen }
                 onClose={ onClose }
                 isCentered={ true }
                 motionPreset={ "slideInBottom" }>

             <ModalOverlay bg={ "blackAlpha.200" }
                           backdropFilter={ "auto" }
                           backdropBlur={ "5px" }/>

             <ModalContent w={ 400 }
                           p={ 2 }
                           rounded={ 20 }>
                { content }
             </ModalContent>

          </Modal>

       </HStack>
   );
}