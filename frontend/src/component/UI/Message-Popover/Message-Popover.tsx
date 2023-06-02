import { ReactNode } from "react";

import { Button, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/react";
import { MAIN_COLOR } from "../../../constant";

interface IMessagePopover {
   children: ReactNode,
   isOpen: boolean,
   onClose: () => void,
   deleteMessage: () => void
}

export function MessagePopover( { children, isOpen, onClose, deleteMessage }: IMessagePopover ) {

   return (
       <Popover isOpen={ isOpen }
                closeOnBlur={ true }
                onClose={ onClose }>

          <PopoverTrigger>
             { children }
          </PopoverTrigger>

          <PopoverContent _focusVisible={ { outline: "none" } }
                          p={ 1 }
                          rounded={ 20 }
                          w={ "fit-content" }>

             <PopoverArrow/>

             <PopoverBody>
                <Button variant={ "ghost" }
                        color={ MAIN_COLOR }
                        onClick={ deleteMessage }
                        rounded={ 5 }
                        _active={ { bg: "#eff0f3" } }
                        _hover={ { bg: "#eff0f3" } }>
                   видалити повідомлення
                </Button>
             </PopoverBody>

          </PopoverContent>

       </Popover>
   );
}