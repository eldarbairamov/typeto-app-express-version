import { useRef } from "react";

import { useInputHandler } from "../../../hook";
import { sendMessageService } from "../../../service";
import { Box, HStack, Input, Textarea } from "@chakra-ui/react";
import { ButtonIcon } from "../../UI";
import { AiOutlineMessage, RxImage } from "react-icons/all";
import { MAIN_COLOR } from "../../../constant";

export function ChatBoxBottom() {
   const { value, handleChange, setValue } = useInputHandler();

   const ref = useRef<HTMLInputElement>(null);

   const handlePick = () => ref.current?.click();

   const { sendImage, sendMessage, onEnterDown } = sendMessageService(setValue, value);

   return (
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
                       resize={ "none" }
                       bg={ "#eff0f3" }
                       wordBreak={ "break-word" }
                       border={ "none" }
                       onKeyDown={ onEnterDown }
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

   );
}