import { calc, VStack, Center, Modal, ModalOverlay, ModalContent, useDisclosure, Button, Divider, Text } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage } from "react-icons/all";
import { ContactList } from "../Contact-List/Contact-List.tsx";
import { useState } from "react";

export function EmptyBox() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [ content, setContent ] = useState<JSX.Element>();

    const openFriendList = () => {
        setContent(<ContactList isOnlyMessage={ true } onModalClose={ onClose }/>);
        onOpen();
    };

    return (
        <VStack h={ calc("100vh").subtract("150px").toString() }
                rounded={ 20 }
                bg={ "white" }
                w={ calc("100%").subtract("450px").toString() }
                spacing={ 0 }>

            <Center h={ '100%' }
                    gap={ 5 }>

                <Button p={ 8 }
                        rounded={ 20 }
                        gap={ 5 }
                        onClick={ openFriendList }>

                    <Text color={ "gray.600" }
                          fontSize={ 17 }>
                        створити бесіду?
                    </Text>

                    <Divider orientation={ 'horizontal' }
                             borderColor={ 'gray.400' }
                             borderWidth={ 1 }
                             h={ 5 }/>

                    <Icon as={ AiOutlineMessage }
                          boxSize={ 30 }
                          cursor={ 'pointer' }
                          color={ 'orange.400' }/>

                </Button>
            </Center>

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

        </VStack>
    );
}