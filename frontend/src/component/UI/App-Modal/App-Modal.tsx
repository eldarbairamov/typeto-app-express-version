import { Modal, ModalContent, ModalOverlay } from "@chakra-ui/react";

interface IModalProps {
   isOpen: boolean;
   onClose: () => void;
   content: JSX.Element | undefined;
   p?: number | string;
}

export function AppModal( { onClose, isOpen, content, p = 2 }: IModalProps ) {
   return (
       <Modal isOpen={ isOpen }
              onClose={ onClose }
              isCentered={ true }
              motionPreset={ "slideInBottom" }>

          <ModalOverlay bg={ "blackAlpha.200" }
                        backdropFilter={ "auto" }
                        backdropBlur={ "5px" }/>

          <ModalContent w={ 400 }
                        p={ p }
                        boxShadow={ "xl" }
                        rounded={ 20 }>
             { content }
          </ModalContent>

       </Modal>
   );
}