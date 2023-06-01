import { useEffect, useRef } from "react";

import { Alert, Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useAppDispatch } from "../../../hook/redux.hook.ts";
import { conversationActions } from "../../../store/slice/conversation.slice.ts";
import { MAIN_COLOR } from "../../../constant/color.constant.ts";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";

interface IToastProps {
   actionMessage: string | undefined;
}

export function Toast( { actionMessage }: IToastProps ) {
   const toast = useToast();

   const buttonRef = useRef<HTMLButtonElement>(null);

   const dispatch = useAppDispatch();

   useEffect(() => {
      if (actionMessage?.length) buttonRef.current?.click();
   }, [ actionMessage ]);

   return (
       <Button ref={ buttonRef }
               style={ { display: "none" } }
               onClick={ () => toast({
                  render: () => (
                      <Alert style={ { position: "fixed" } } w={ "fit-content" } bg={ "transparent" }>
                         <HStack bg={ MAIN_COLOR } w={ "100%" } p={ 3 } rounded={ 10 }>
                            <Icon as={ BiBell } color={ "white" } boxSize={ 5 }/>
                            <Text fontWeight={ "bold" } color={ "white" }> { actionMessage } </Text>
                         </HStack>
                      </Alert>
                  ),
                  duration: 2000,
                  position: "top",
                  onCloseComplete: () => dispatch(conversationActions.setActionMessage(undefined))
               }) }>
       </Button>
   );
}