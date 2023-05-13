import { Avatar, HStack, Text, VStack } from "@chakra-ui/react";

export function IncomingMessage() {
   return (
       <VStack alignItems={ "flex-start" }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }>
             <Avatar name={ "John" }
                     size={ "md" }/>

             <VStack w={ [ null, null, null, 300, 600 ] }
                     bg={ "#eff0f3" }
                     p={ 5 }
                     borderRadius={ "0 30px 30px 30px" }>
                <Text>
                   Hello Designers,

                   We are working on chatbot web application where user can easy communicate with client or friends.
                   They can easily create the groups and share the files with each other. We want our design clean and
                   simple at the same time User friendly also.
                   We are working on chatbot web application where user can easy communicate with client or friends.
                   They can easily create the groups and share the files with each other. We want our design clean and
                   simple at the same time User friendly also.
                </Text>
             </VStack>
          </HStack>


       </VStack>
   );
}