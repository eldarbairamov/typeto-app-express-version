import { Button, Heading, Highlight, HStack, Modal, ModalContent, ModalOverlay, useDisclosure } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BiSearch, IoMdLogOut, FiUsers } from "react-icons/all";
import { useState } from "react";
import { FindUser } from "../Find-User/Find-User.tsx";
import { ContactList } from "../Contact-List/Contact-List.tsx";

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

          <Heading cursor={ 'default' }
                   size={ "xl" }>
             <Highlight query={ "to" }
                        styles={ { color: "white", p: "2px 10px", rounded: "lg", bg: "messenger.400" } }>
                typeto
             </Highlight>
          </Heading>

          <HStack spacing={ 5 }>

             <Button variant={ "unstyled" }
                     onClick={ openFriendList }>
                <Icon as={ FiUsers }
                      boxSize={ "30px" }
                      color={ "gray.600" }/>
             </Button>

             <Button variant={ "unstyled" }
                     onClick={ openFindUsers }>
                <Icon as={ BiSearch }
                      boxSize={ "32px" }
                      color={ "gray.600" }/>
             </Button>

             <Button variant={ "unstyled" }>
                <Icon as={ IoMdLogOut }
                      boxSize={ "30px" }
                      color={ "gray.600" }/>
             </Button>

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