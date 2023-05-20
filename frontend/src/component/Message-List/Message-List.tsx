import { calc, VStack } from "@chakra-ui/react";
import { OutcomingMessage } from "../Outcoming-Message/Outcoming-Message.tsx";
import { v4 } from "uuid";
import { IncomingMessage } from "../Incoming-Message/Incoming-Message.tsx";
import { useAppSelector } from "../../hook/redux.hook.ts";

export function MessageList() {
   const { currentUserId } = useAppSelector(state => state.authReducer);
   const { messages } = useAppSelector(state => state.messageReducer);

   return (
       <VStack h={ calc("100%").subtract("100px").toString() }
               spacing={ -5 }
               p={ "20px 20px 0 20px" }
               overflow={ "scroll" }
               w={ "100%" }>

          { messages.map(message => {
             if (message.sender.id === currentUserId) {
                return <OutcomingMessage key={ v4() } message={ message }/>;
             }
             if (message.sender.id !== currentUserId) {
                return <IncomingMessage key={ v4() } message={ message }/>;
             }
          }) }

       </VStack>
   );
}