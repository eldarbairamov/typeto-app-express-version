import { VStack, Center } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { SlSocialDropbox } from "react-icons/all";

export function EmptyBox() {
   return (
       <VStack h={ "100%" }
               rounded={ 20 }
               bg={ "white" }
               borderRadius={ "0 20px 20px 0" }
               w={ "100%" }
               spacing={ 0 }>

          <Center h={ "100%" }
                  flexDir={ "column" }
                  gap={ 5 }>

             <Icon as={ SlSocialDropbox } boxSize={ 20 } color={ "gray.600" }/>

          </Center>

       </VStack>
   );
}