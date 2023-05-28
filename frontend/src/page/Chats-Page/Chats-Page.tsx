import { calc, HStack } from "@chakra-ui/react";
import { SideBar } from "../../component/SIde-Bar/Side-Bar/Side-Bar.tsx";
import { ChatBox } from "../../component/Chat-Box/Chat-Box/Chat-Box.tsx";
import { useAppSelector } from "../../hook/redux.hook.ts";
import { Toast } from "../../component/UI/Toast/Toast.tsx";

export function ChatsPage() {
   const { actionMessage } = useAppSelector(state => state.conversationReducer);

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

          <Toast actionMessage={ actionMessage }/>

       </HStack>
   );
}
