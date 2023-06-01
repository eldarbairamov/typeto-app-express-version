import { useRef, useState } from "react";

import moment from "moment/moment";
import { Avatar, Heading, HStack, Image, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { IMessage } from "../../../interface/message.interface.ts";
import { MAIN_COLOR, MESSAGE_OUTCOMING_COLOR_ } from "../../../constant/color.constant.ts";
import { getImageUrl } from "../../../helper/get-image-url.helper.ts";
import { AppModal } from "../../UI/App-Modal/App-Modal.tsx";
import { ShowImage } from "../Show-Image/Show-Image.tsx";
import { MessagePopover } from "../../UI/Message-Popover/Message-Popover.tsx";
import { useContextMenu } from "../../../hook/use-context-menu.hook.ts";
import { messageAsyncActions } from "../../../store/slice/message.slice.ts";
import { useAppDispatch } from "../../../hook/redux.hook.ts";

interface IOutcomingMessage {
   message: IMessage;
}

export function OutcomingMessage( { message }: IOutcomingMessage ) {
   const { isOpen, onOpen, onClose } = useDisclosure();

   const { isCtxMenuOpen, openCtxMenu, closeCtxMenu } = useContextMenu();

   const [ content, setContent ] = useState<JSX.Element>();

   const conversationTime = moment(+message.lastModified).format("HH:mm");

   const dispatch = useAppDispatch();

   const messageItemRef = useRef<HTMLDivElement>(null);

   const deleteMessage = async () => dispatch(messageAsyncActions.deleteMessage({ messageId: message.id, conversationId: message.conversationId }));

   const openImage = () => {
      setContent(<ShowImage image={ message.content } userEmail={ message.sender.email }/>);
      onOpen();
   };

   return (
       <VStack alignItems={ "flex-end" }
               ref={ messageItemRef }
               w={ "100%" }>

          <HStack alignItems={ "flex-start" }
                  gap={ 5 }
                  marginBottom={ 10 }>

             <MessagePopover isOpen={ isCtxMenuOpen }
                             deleteMessage={ deleteMessage }
                             onClose={ closeCtxMenu }>

                <VStack maxW={ [ null, null, null, 300, 600 ] }
                        bg={ message.isImage ? "transparent" : MESSAGE_OUTCOMING_COLOR_ }
                        alignItems={ "flex-end" }
                        cursor={ "pointer" }
                        borderRadius={ "20px 0 20px 20px" }
                        transition={ ".3s" }
                        _hover={ message.isImage ? { transform: "scale(1.015)" } : { transform: "scale(1.05)" } }
                        style={ isCtxMenuOpen ? (message.isImage ? { transform: "scale(1.015)" } : { transform: "scale(1.05)" }) : {} }
                        onContextMenu={ openCtxMenu }
                        spacing={ message.isImage ? 7 : 1 }
                        p={ 5 }>

                   <Heading size={ "sm" }
                            color={ message.isImage ? MAIN_COLOR : "white" }>
                      { message.sender.username }
                   </Heading>

                   { message.isImage
                       ?
                       <Image src={ getImageUrl(message.content, message.sender.email) }
                              rounded={ 20 }
                              transition={ ".3s" }
                              onClick={ openImage }
                              h={ [ "100px", "200px", "300px", "300px", "500px" ] }/>
                       :
                       <Text color={ "white" }>
                          { message.content }
                       </Text>
                   }

                </VStack>
             </MessagePopover>

             <VStack>
                <Avatar name={ message.sender.username }
                        ignoreFallback={ true }
                        src={ getImageUrl(message.sender.image, message.sender.email) }
                        size={ "md" }/>

                <Text> { conversationTime } </Text>
             </VStack>

          </HStack>

          <AppModal isOpen={ isOpen }
                    onClose={ onClose }
                    content={ content }
                    p={ 0 }/>

       </VStack>
   );
}