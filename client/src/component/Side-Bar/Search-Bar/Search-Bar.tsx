import { useEffect } from "react";

import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { conversationActions } from "../../../store/slice";
import { useAppDispatch, useDebounce, useInputHandler } from "../../../hook";

export function SearchBar( { height, width }: { height?: string | number, width?: string | number } ) {
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
               height={ height ? height : "60px" }
               w={ width ? width : "90%" }>

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