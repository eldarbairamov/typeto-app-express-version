import { calc, HStack } from "@chakra-ui/react";
import { ChatBox, SideBar } from "../../component";

export function ChatsPage() {

   return (
       <HStack spacing={ 0 }
               w={ "100%" }
               boxShadow={ "xl" }
               rounded={ "20px" }
               h={ calc("100%").subtract("150px").toString() }
               justify={ "space-between" }
               alignItems={ "flex-start" }>

          <SideBar/>

          <ChatBox/>

       </HStack>
   );
}
