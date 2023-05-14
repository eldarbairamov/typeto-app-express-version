import { Avatar, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { IMessage } from "../../interface/message.interface.ts";

export function IncomingMessage( { message }: { message: IMessage } ) {
   const conversationTime = moment(+message.lastModified).format('HH:mm');

   return (
       <VStack alignItems={ "flex-start" }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack>
                <Avatar name={ message.sender.username }
                        size={ "md" }/>

                <Text color={ 'gray.500' }> { conversationTime } </Text>
             </VStack>

             <VStack maxW={ [ null, null, null, 300, 600 ] }
                     bg={ "gray.100" }
                     alignItems={ 'flex-start' }
                     rounded={ 20 }
                     p={ 5 }>
                <Heading size={ 'sm' }> { message.sender.username } </Heading>

                <Text>
                   { message.content }
                </Text>
             </VStack>


          </HStack>


       </VStack>
   );
}