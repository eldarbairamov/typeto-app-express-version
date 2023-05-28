import { Avatar, Heading, HStack, Image, Text, VStack } from "@chakra-ui/react";
import moment from "moment";
import { IMessage } from "../../../interface/message.interface.ts";
import { useEffect, useRef } from "react";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";
import { MAIN_COLOR, MESSAGE_OUTCOMING_COLOR_ } from "../../../constant/color.constant.ts";

export function IncomingMessage( { message }: { message: IMessage } ) {
   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const ref = useRef<any>();

   useEffect(() => {
      ref.current?.scrollIntoView({ behavior: "auto" });
   }, []);

   return (
       <VStack alignItems={ "flex-start" }
               ref={ ref }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <VStack>
                <Avatar name={ message.sender.username }
                        ignoreFallback={ true }
                        src={ getImageUrl(message.sender.image, message.sender.email) }
                        size={ "md" }/>

                <Text> { conversationTime } </Text>
             </VStack>

             <VStack maxW={ [ null, null, null, 300, 600 ] }
                     bg={ message.isImage ? "transparent" : MESSAGE_OUTCOMING_COLOR_ }
                     alignItems={ "flex-start" }
                     borderRadius={ "0 20px 20px 20px" }
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
                    <Text color={ "white" }> { message.content } </Text>
                }

             </VStack>

          </HStack>

       </VStack>
   );
}