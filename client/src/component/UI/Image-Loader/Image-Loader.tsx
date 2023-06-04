import { Alert, HStack, Spinner, Text } from "@chakra-ui/react";
import { MAIN_COLOR } from "../../../constant";

export function ImageLoader() {

   return (
       <Alert style={ { position: "fixed" } }
              w={ "fit-content" }
              bg={ "transparent" }
              zIndex={ 100 }>

          <HStack bg={ MAIN_COLOR }
                  w={ "100%" }
                  p={ 3 }
                  rounded={ 10 }
                  spacing={ 3 }
                  justifyContent={ "center" }>

             <Spinner size={ "sm" }
                      thickness={ "2px" }
                      color={ "white" }/>

             <Text color={ "white" }>
                зачекайте...
             </Text>

          </HStack>

       </Alert>
   );
}