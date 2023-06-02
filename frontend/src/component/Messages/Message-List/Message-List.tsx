import { Alert, calc, Center, Spinner, useDisclosure, VStack, Text, HStack } from "@chakra-ui/react";
import { v4 } from "uuid";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";
import { useAppSelector } from "../../../hook";
import { scrollService } from "../../../service";
import { ALERT_COLOR, MAIN_COLOR } from "../../../constant";
import { OutcomingMessage, IncomingMessage } from "../../Messages";

export function MessageList() {
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const { isMessagesLoading, messages, isNewMessageAdded, isImageSending, isMessageSending } = useAppSelector(state => state.messageReducer);

   const { isOpen: isVisible, onClose, onOpen, } = useDisclosure();

   const { messageListRef } = scrollService(isNewMessageAdded, messages, onClose, onOpen);

   if (isMessagesLoading) {
      return (
          <Center w={ "100%" }
                  h={ calc("100%").subtract("100px").toString() }>
             <Spinner size={ "xl" } thickness={ "5px" } color={ MAIN_COLOR }/>
          </Center>
      );
   }

   return (
       <VStack h={ calc("100%").subtract("100px").toString() }
               position={ "relative" }
               spacing={ -5 }
               ref={ messageListRef }
               p={ "20px 40px 0 40px" }
               overflow={ "scroll" }
               w={ "100%" }>

          { isVisible &&
              <Alert style={ { position: "fixed" } } w={ 150 } bg={ "transparent" }>
                <HStack bg={ ALERT_COLOR } w={ "100%" } p={ 3 } rounded={ 10 } justifyContent={ "center" }>
                  <Icon as={ BiBell } color={ "white" } boxSize={ 5 }/>
                  <Text fontWeight={ "bold" } color={ "white" }> нове повідомлення </Text>
                </HStack>
              </Alert>
          }

          { (isImageSending || isMessageSending) &&
              <Alert style={ { position: "fixed" } } w={ 150 } bg={ "transparent" }>
                <HStack bg={ MAIN_COLOR } w={ "100%" } p={ 3 } rounded={ 10 } spacing={ 3 } justifyContent={ "center" }>
                  <Spinner size={ "sm" } thickness={ "3px" } color={ "white" }/>
                  <Text fontWeight={ "bold" } color={ "white" }> зачекайте... </Text>
                </HStack>
              </Alert>
          }

          { Boolean(messages.length) && messages.map(message => {
             if (message.sender.id === currentUserInfo.id) {
                return <OutcomingMessage key={ v4() }
                                         message={ message }/>;
             }
             if (message.sender.id !== currentUserInfo.id) {
                return <IncomingMessage key={ v4() }
                                        message={ message }/>;
             }
          }) }


       </VStack>
   );
}