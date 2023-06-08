import { useRef } from "react";

import { useAppSelector, useInputHandler } from "../../../hook";
import { sendMessageService } from "../../../service";
import { Box, HStack, Input, Text, Textarea, VStack } from "@chakra-ui/react";
import { ButtonIcon } from "../../UI";
import { AiOutlineMessage, RxImage } from "react-icons/all";
import { MAIN_COLOR } from "../../../constant";

export function ChatBoxBottom() {
   const { value, handleChange, setValue } = useInputHandler();

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const { sendImage, sendMessage, onEnterDown } = sendMessageService(setValue, value);

   const { whoIsTyping } = useAppSelector(state => state.appReducer);

   return (
       <VStack w={ "100%" }
               position={ "relative" }
               spacing={ 0 }>

          { whoIsTyping.status &&
              <VStack position={ "absolute" } bottom={ 100 }>
                <HStack spacing={ 1 }>
                  <Text fontWeight={ "bold" }
                        fontSize={ 13 }
                        color={ MAIN_COLOR }>
                     { whoIsTyping.username }
                  </Text>

                  <Text fontSize={ 13 }
                        color={ "gray.500" }
                        fontStyle={ "italic" }>
                    щось друкує...
                  </Text>
                </HStack>
              </VStack>
          }

          <HStack h={ "100px" }
                  justify={ "center" }
                  w={ "100%" }>

             <ButtonIcon size={ 10 }
                         as={ RxImage }
                         color={ MAIN_COLOR }
                         fn={ handlePick }/>

             <Box w={ "60%" }
                  bg={ "#eff0f3" }
                  rounded={ 15 }
                  padding={ 3 }>

                <Textarea rows={ 1 }
                          autoFocus={ true }
                          resize={ "none" }
                          bg={ "#eff0f3" }
                          wordBreak={ "break-word" }
                          border={ "none" }
                          onKeyDown={ value !== "" ? onEnterDown : undefined }
                          value={ value }
                          onChange={ handleChange }
                          focusBorderColor={ "transparent" }
                          placeholder={ "Написати..." }/>
             </Box>

             <ButtonIcon size={ 10 }
                         as={ AiOutlineMessage }
                         color={ MAIN_COLOR }
                         fn={ value !== "" ? sendMessage : undefined }/>

             <Input style={ { display: "none" } }
                    onChange={ sendImage }
                    type={ "file" }
                    ref={ ref }/>

          </HStack>
       </VStack>
   );
}