import { LoginForm, Logo, Toast } from "../../component";
import { useAppSelector } from "../../hook";
import { Center } from "@chakra-ui/react";
import { MAIN_COLOR } from "../../constant";

export function LoginPage() {
   const { actionMessage, actionType } = useAppSelector(state => state.appReducer);

   return (
       <Center h={ "100vh" } gap={ 100 } flexDirection={ { base: "column", md: "row" } }>
          <Toast actionMessage={ actionMessage } actionType={ actionType }/>

          <Logo color={ MAIN_COLOR }/>

          <LoginForm/>

       </Center>
   );
}
