import { useEffect, useRef } from "react";

import { Alert, Button, HStack, Text, useToast } from "@chakra-ui/react";
import { useAppDispatch } from "../../../hook";
import { ALERT_COLOR, MAIN_COLOR } from "../../../constant";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";
import { appActions } from "../../../store/slice";

interface IToastProps {
   actionMessage: string | undefined;
   actionType: "info" | "error";
}

export function Toast( { actionMessage, actionType }: IToastProps ) {
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
                      <Alert bg={ "transparent" } justifyContent={ "center" }>
                         <HStack bg={ actionType === "info" ? MAIN_COLOR : ALERT_COLOR } w={ "fit-content" } p={ 3 } rounded={ 10 }>
                            <Icon as={ BiBell } color={ "white" } boxSize={ 5 }/>
                            <Text fontWeight={ "bold" } color={ "white" }> { actionMessage } </Text>
                         </HStack>
                      </Alert>
                  ),
                  duration: 2000,
                  position: "top",
                  onCloseComplete: () => dispatch(appActions.setActionMessage({ message: undefined }))
               }) }>
       </Button>
   );
}