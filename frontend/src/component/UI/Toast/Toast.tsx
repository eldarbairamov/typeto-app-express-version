import { useEffect, useRef } from "react";

import { Button, useToast } from "@chakra-ui/react";
import { useAppDispatch } from "../../../hook/redux.hook.ts";
import { conversationActions } from "../../../store/slice/conversation.slice.ts";

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
                  description: actionMessage,
                  colorScheme: "blue",
                  status: "info",
                  duration: 1500,
                  position: "top",
                  onCloseComplete: () => dispatch(conversationActions.setActionMessage(undefined))
               }) }>
       </Button>
   );
}