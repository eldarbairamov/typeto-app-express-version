import { useEffect, useRef } from "react";

import { Avatar, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import { IMessage } from "../../../interface/message.interface.ts";
import moment from "moment/moment";
import { MAIN_COLOR, MESSAGE_OUTCOMING_COLOR_ } from "../../../constant/color.constant.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";

export function OutcomingMessage( { message }: { message: IMessage } ) {
   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const ref = useRef<HTMLDivElement>(null);

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
                     bg={ message.isImage ? "transparent" : MESSAGE_OUTCOMING_COLOR_ }
                     alignItems={ "flex-end" }
                     borderRadius={ "20px 0 20px 20px" }
                     spacing={ message.isImage ? 7 : 1 }
                     p={ 5 }>

                <Heading size={ "sm" }
                         color={ message.isImage ? MAIN_COLOR : "white" }>
                   { message.sender.username }
                </Heading>

                { message.isImage
                    ?
                    <Image src={ getImageUrl(message.content, message.sender.email) }
                           borderRadius={ 20 }
                           h={ [ "100px", "200px", "300px", "300px", "500px" ] }/>
                    :
                    <Text color={ "white" }>
                       { message.content }
                    </Text>
                }

             </VStack>

             <VStack>
                <Avatar name={ message.sender.username }
                        ignoreFallback={ true }
                        src={ getImageUrl(message.sender.image, message.sender.email) }
                        size={ "md" }/>

                <Text> { conversationTime } </Text>
             </VStack>

          </HStack>


       </VStack>
   );
}