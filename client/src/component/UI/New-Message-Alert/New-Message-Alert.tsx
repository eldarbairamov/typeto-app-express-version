import { Alert, HStack, Text } from "@chakra-ui/react";
import { MAIN_COLOR } from "../../../constant";
import { Icon } from "@chakra-ui/icons";
import { BiBell } from "react-icons/all";

export function NewMessageAlert({ scrollToBottom }: { scrollToBottom: () => void }) {

   return (
       <Alert style={ { position: "fixed" } }
              cursor={ "pointer" }
              w={ "fit-content" }
              bg={ "transparent" }
              zIndex={ 100 }
              onClick={ scrollToBottom }>

          <HStack bg={ MAIN_COLOR }
                  w={ "100%" }
                  p={ 3 }
                  rounded={ 10 }
                  justifyContent={ "center" }>

             <Icon as={ BiBell }
                   color={ "white" }
                   boxSize={ 5 }/>

             <Text fontWeight={ "bold" }
                   color={ "white" }>
                нове повідомлення
             </Text>

          </HStack>

       </Alert>
   );

}