import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useDebounce } from "../../../hook/use-debounce.hook.ts";
import { useInputHandler } from "../../../hook/use-input-handler.ts";
import { useEffect } from "react";
import { useAppDispatch } from "../../../hook/redux.hook.ts";
import { conversationActions } from "../../../store/slice/conversation.slice.ts";

export function SearchBar() {
   const { value, handleChange } = useInputHandler();

   const debounced = useDebounce(value);

   const dispatch = useAppDispatch();

   useEffect(() => {
      if (debounced.length >= 1) dispatch(conversationActions.setSearchKey(debounced));
      if (debounced.length < 1) dispatch(conversationActions.setSearchKey(undefined));
   }, [ debounced ]);

   return (
       <Center bg={ "white" }
               rounded={ 20 }
               height={ "60px" }
               w={ "90%" }>

          <InputGroup w={ "90%" }>
             <InputLeftElement pointerEvents={ "none" }
                               children={ <Search2Icon color={ "gray.500" }/> }/>

             <Input border={ "none" }
                    focusBorderColor={ "white" }
                    onChange={ handleChange }
                    value={ value }
                    placeholder={ "знайти діалог" }/>
          </InputGroup>

       </Center>
   );
}