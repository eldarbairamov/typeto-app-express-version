import { Center } from "@chakra-ui/react";
import { Logo, RegistrationForm } from "../../component";
import { MAIN_COLOR } from "../../constant";

export function RegistrationPage() {

   return (
       <Center height={ "100vh" }
               gap={ 100 }
               flexDirection={ { base: "column", md: "row" } }>

          <Logo color={ MAIN_COLOR}/>

          <RegistrationForm/>

       </Center>
   );
}
