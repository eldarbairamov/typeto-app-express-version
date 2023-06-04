import { Avatar, Heading, HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import moment from "moment";
import { IMessage } from "../../../interface";
import { getImageUrl } from "../../../helper";
import { MAIN_COLOR, MESSAGE_INCOMING_COLOR_ } from "../../../constant";
import { AppModal } from "../../UI";
import { useState } from "react";
import { ShowImage } from "../Show-Image/Show-Image.tsx";

interface IIncomingMessage {
   message: IMessage;
}

export function IncomingMessage( { message }: IIncomingMessage ) {
   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const { isOpen, onOpen, onClose } = useDisclosure();

   const [ content, setContent ] = useState<JSX.Element>();

   const openImage = () => {
      setContent(<ShowImage image={ message.content } userEmail={ message.sender.email }/>);
      onOpen();
   };

   return (
       <VStack alignItems={ "flex-start" }
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
                     bg={ message.isImage ? "transparent" : MESSAGE_INCOMING_COLOR_ }
                     alignItems={ "flex-start" }
                     rounded={ "0 20px 20px 20px" }
                     spacing={ message.isImage ? 7 : 1 }
                     p={ 5 }>

                <Heading size={ "sm" }
                         color={ message.isImage ? MAIN_COLOR : "black" }>
                   { message.sender.username }
                </Heading>

                { message.isImage
                    ? <Image src={ getImageUrl(message.content, message.sender.email) }
                             borderRadius={ 20 }
                             cursor={ "pointer" }
                             onClick={ openImage }
                             h={ [ "100px", "200px", "300px", "300px", "500px" ] }/>

                    : <Text color={ "gray.700" }> { message.content } </Text>
                }

             </VStack>

          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }
                    p={ 0 }/>

       </VStack>
   );
}