import { Header } from "../component/Header/Header.tsx";
import { Center, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function MainLayout() {
   return (
       <Center w={ [ "800px", "100%", "100%", "100%", "100%" ] }>
          <VStack w={ "90%" }
                  h={ "100vh" }
                  spacing={ 0 }>
             <Header/>
             <Outlet/>
          </VStack>
       </Center>
   );
}