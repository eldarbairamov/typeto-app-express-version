import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";

export function SearchBar() {
   return (
       <Center bg={ "white" }
               rounded={ 20 }
               height={ '60px' }
               w={ "90%" }>

          <InputGroup w={ "90%" }>
             <InputLeftElement pointerEvents={ "none" }
                               children={ <Search2Icon color={ "gray.500" }/> }/>

             <Input border={ "none" }
                    focusBorderColor={ "white" }
                    placeholder={ "знайти діалог" }/>
          </InputGroup>

       </Center>
   );
}