import { calc, Center, Spinner, VStack } from "@chakra-ui/react";
import { OutcomingMessage } from "../Outcoming-Message/Outcoming-Message.tsx";
import { v4 } from "uuid";
import { IncomingMessage } from "../Incoming-Message/Incoming-Message.tsx";
import { useAppSelector } from "../../../hook/redux.hook.ts";
import { MAIN_COLOR } from "../../../constant/color.constant.ts";

export function MessageList() {
   const { currentUserInfo } = useAppSelector(state => state.userReducer);
   const { isLoading, messages } = useAppSelector(state => state.messageReducer);

   if (isLoading) {
      return (
          <Center w={ "100%" }
                  h={ calc("100%").subtract("100px").toString() }>
             <Spinner size={ "xl" } thickness={ "5px" } color={ MAIN_COLOR }/>
          </Center>
      );
   }

   return (
       <VStack h={ calc("100%").subtract("100px").toString() }
               spacing={ -5 }
               p={ "20px 40px 0 40px" }
               overflow={ "scroll" }
               w={ "100%" }>


          { messages.map(message => {
             if (message.sender.id === currentUserInfo.id) {
                return <OutcomingMessage key={ v4() } message={ message }/>;
             }
             if (message.sender.id !== currentUserInfo.id) {
                return <IncomingMessage key={ v4() } message={ message }/>;
             }
          }) }

       </VStack>
   );
}