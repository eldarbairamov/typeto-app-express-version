import { useEffect, useRef, useState } from "react";

import { Alert, calc, Center, Spinner, useDisclosure, VStack, Text, HStack } from "@chakra-ui/react";
import { OutcomingMessage } from "../Outcoming-Message/Outcoming-Message.tsx";
import { v4 } from "uuid";
import { IncomingMessage } from "../Incoming-Message/Incoming-Message.tsx";
import { useAppSelector } from "../../../hook/redux.hook.ts";
import { ALERT_COLOR, MAIN_COLOR } from "../../../constant/color.constant.ts";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";

export function MessageList() {
   const { currentUserInfo } = useAppSelector(state => state.userReducer);

   const { isLoading, messages, isNewMessageAdded } = useAppSelector(state => state.messageReducer);

   const { isOpen: isVisible, onClose, onOpen, } = useDisclosure();

   const messageListRef = useRef<HTMLDivElement>(null);

   const [ prevStateLength, setPrevStateLength ] = useState<number>(0);

   const [ isBlindZone, setIsBlindZone ] = useState<boolean>(false);

   const scrollHandler = () => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;
      const scrollT = messageListRef.current?.scrollTop as number;

      if ((scrollH - clientH - 500) > scrollT) {
         setIsBlindZone(true);
      }

      if ((Math.ceil(scrollT) === (scrollH - clientH))) {
         setIsBlindZone(false);
      }

   };

   useEffect(() => {
      setPrevStateLength(messages.length);

      if ((messages.length > prevStateLength) && isBlindZone && !isNewMessageAdded) {
         onOpen();
      }

      if (!isBlindZone) onClose();

   }, [ messages, isBlindZone ]);

   useEffect(() => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;

      if (!isBlindZone || isNewMessageAdded) messageListRef.current?.scrollTo({ behavior: "auto", top: scrollH - clientH });

   }, [ scrollHandler, isBlindZone ]);


   useEffect(() => {
      const scrollListener = messageListRef.current?.addEventListener("scroll", scrollHandler);
      return () => removeEventListener("scroll", scrollListener!);
   });

   if (isLoading) {
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
              <Alert style={ { position: "fixed" } } w={ "fit-content" } bg={ "transparent" }>
                <HStack bg={ ALERT_COLOR } w={ "100%" } p={ 3 } rounded={ 10 }>
                  <Icon as={ BiBell } color={ "white" } boxSize={ 5 }/>
                  <Text fontWeight={ "bold" } color={ "white" }> нове повідомлення </Text>
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