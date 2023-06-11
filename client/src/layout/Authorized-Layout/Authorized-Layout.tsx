import { Center, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { firstTouchService } from "../../service";
import { Header, Toast } from "../../component";
import { useAppSelector } from "../../hook";

export function AuthorizedLayout() {
   const { actionMessage, actionType } = useAppSelector(state => state.appReducer);

   firstTouchService();

   return (
       <Center w={ [ "800px", "100%", "100%", "100%", "100%" ] }>

          <VStack w={ "90%" }
                  h={ "100vh" }
                  spacing={ 0 }>

             <Header/>

             <Outlet/>

          </VStack>

          <Toast actionMessage={ actionMessage } actionType={ actionType }/>

       </Center>
   );

}