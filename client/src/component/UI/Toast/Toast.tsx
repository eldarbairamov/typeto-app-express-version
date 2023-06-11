import { useEffect, useRef } from "react";

import { Alert, Button, HStack, Spinner, Text, useToast, UseToastOptions } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../../hook";
import { ALERT_COLOR, MAIN_COLOR } from "../../../constant";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";
import { appActions } from "../../../store/slice";

interface IToastProps {
   actionMessage: string | undefined;
   actionType: "info" | "error" | "loading";
}

export function Toast( { actionMessage, actionType }: IToastProps ) {
   const { isToastIsClosed } = useAppSelector(state => state.appReducer);

   const toast = useToast();

   const buttonRef = useRef<HTMLButtonElement>(null);

   const dispatch = useAppDispatch();

   useEffect(() => {
      if (actionMessage?.length) buttonRef.current?.click();
   }, [ actionMessage ]);

   useEffect(() => {
      isToastIsClosed && toast.closeAll();
   }, [ isToastIsClosed ]);


   const options: Omit<UseToastOptions, "id"> = {
      render: () => (
          <Alert bg={ "transparent" } justifyContent={ "center" }>

             <HStack bg={ actionType === "info" || actionType === "loading" ? MAIN_COLOR : ALERT_COLOR }
                     w={ "fit-content" }
                     p={ 3 }
                     rounded={ 10 }>

                { actionType === "loading"

                    ? <Spinner size={ "sm" }
                               thickness={ "2px" }
                               color={ "white" }/>

                    : <Icon as={ BiBell }
                            color={ "white" }
                            boxSize={ 5 }/>
                }

                <Text fontWeight={ "bold" }
                      color={ "white" }>
                   { actionMessage }
                </Text>

             </HStack>

          </Alert>
      ),
      duration: 2000,
      position: "top",
      onCloseComplete: () => dispatch(appActions.setActionMessage({ message: undefined }))
   };

   const activateToast = () => {
      toast.closeAll();
      toast(options);
   };

   return (
       <Button ref={ buttonRef }
               style={ { display: "none" } }
               onClick={ activateToast }>
       </Button>
   );
}