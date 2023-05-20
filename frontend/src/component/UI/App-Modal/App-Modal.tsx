import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

interface IModalProps {
   isOpen: boolean;
   onClose: () => void;
   content: JSX.Element | undefined;
}

export function AppModal( { onClose, isOpen, content }: IModalProps ) {
   return (
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
   );
}