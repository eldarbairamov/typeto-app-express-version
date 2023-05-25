import { useEffect, useRef } from "react";

import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { IMessage } from "../../interface/message.interface.ts";
import moment from "moment/moment";
import { MESSAGE_OUTCOMING_COLOR_ } from "../../constant/color.constant.ts";

export function OutcomingMessage( { message }: { message: IMessage } ) {
   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const ref = useRef<any>();

   useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "auto" });
   }, []);

   return (
       <VStack alignItems={ "flex-end" }
               ref={ ref }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack maxW={ [ null, null, null, 300, 600 ] }
                     bg={ MESSAGE_OUTCOMING_COLOR_ }
                     alignItems={ "flex-end" }
                     borderRadius={ "20px 0 20px 20px" }
                     p={ 5 }>
                <Heading size={ "sm" } color={ "white" }> { message.sender.username } </Heading>

                <Text color={ "white" }>
                   { message.content }
                </Text>
             </VStack>

             <VStack>
                <Avatar name={ message.sender.username }
                        size={ "md" }/>

                <Text> { conversationTime } </Text>
             </VStack>


          </HStack>


       </VStack>
   );
}