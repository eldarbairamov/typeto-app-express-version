import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

export function OutcomingMessage() {
   return (
       <VStack alignItems={ "flex-end" }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack w={ [ null, null, null, 300, 600 ] }
                     bg={ "orange.100" }
                     p={ 5 }
                     borderRadius={ "30px 0px 30px 30px" }>
                <Text>
                   Hello Designers,

                   We are working on chatbot web application where user can easy communicate with client or friends.
                   They can easily create the groups and share the files with each other. We want our design clean and
                   simple at the same time User friendly also.
                </Text>
             </VStack>
             <Avatar name={ "eldar" }
                     size={ "md" }/>

          </HStack>


       </VStack>
   );
}