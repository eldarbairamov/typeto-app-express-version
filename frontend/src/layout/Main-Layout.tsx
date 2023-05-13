import { Header } from "../component/Header/Header.tsx";
import { Center, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function MainLayout() {
   return (
       <Center>
          <VStack w={ "90%" }
                  spacing={ 0 }
                  h={ "100vh" }>
             <Header/>
             <Outlet/>
          </VStack>
       </Center>
   );
}