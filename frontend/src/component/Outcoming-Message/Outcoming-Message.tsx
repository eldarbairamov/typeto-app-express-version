import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { IMessage } from "../../interface/message.interface.ts";
import moment from "moment/moment";
import { useEffect, useRef } from "react";

export function OutcomingMessage( { message }: { message: IMessage } ) {
   const conversationTime = moment(+message.lastModified).format('HH:mm');

   const ref = useRef<any>();

   useEffect(() => {
      ref.current?.scrollIntoView({ behavior: 'auto' });
   }, []);

   return (
       <VStack alignItems={ "flex-end" }
               ref={ ref }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack maxW={ [ null, null, null, 300, 600 ] }
                     bg={ "orange.100" }
                     alignItems={ 'flex-end' }
                     rounded={ 20 }
                     p={ 5 }>
                <Heading size={ 'sm' }> { message.sender.username } </Heading>

                <Text>
                   { message.content }
                </Text>
             </VStack>

             <VStack>
                <Avatar name={ message.sender.username }
                        size={ "md" }/>

                <Text color={ 'gray.500' }> { conversationTime } </Text>
             </VStack>


          </HStack>


       </VStack>
   );
}