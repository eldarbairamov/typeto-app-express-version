import { LoginForm, Logo } from "../../component";
import { Center } from "@chakra-ui/react";
import { MAIN_COLOR } from "../../constant";

export function LoginPage() {
   return (
       <Center h={ "100vh" }
               gap={ 100 }
               flexDirection={ { base: "column", md: "row" } }>

          <Logo color={ MAIN_COLOR }/>

          <LoginForm/>

       </Center>
   );
}
