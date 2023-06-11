import { Button, FormControl, FormErrorMessage, FormLabel, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import { MAIN_COLOR_LIGHTER } from "../../../constant";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { UseFormRegister } from "react-hook-form";
import { useHidePass } from "../../../hook";

interface IAppFormControlPass {
   errorMessage: string | undefined;
   register: UseFormRegister<any>;
   labelName: string;
   fieldName: string;
   isRequired?: boolean;
}

export function AppFormControlPass( { labelName, fieldName, errorMessage, register, isRequired }: IAppFormControlPass ) {

   const { isShow, handleClick } = useHidePass();

   return (
       <FormControl isInvalid={ Boolean(errorMessage) }
                    isRequired={ isRequired ? isRequired : false }
                    h={ 100 }>

          <FormLabel color={ "blackAlpha.600" }> { labelName } </FormLabel>

          <InputGroup>

             <Input { ...register(fieldName) }
                    autoComplete={ "" }
                    focusBorderColor={ MAIN_COLOR_LIGHTER }
                    variant={ "flushed" }
                    _invalid={ { borderColor: "red.500" } }
                    type={ isShow ? "text" : "password" }/>

             <InputRightElement>

                <Button variant={ "unstyled" }
                        onClick={ handleClick }>
                   { isShow ?
                       <ViewOffIcon boxSize={ 5 }
                                    color={ "gray.500" }/>
                       :
                       <ViewIcon boxSize={ 5 }
                                 color={ "gray.500" }/>
                   }
                </Button>

             </InputRightElement>

          </InputGroup>

          <FormErrorMessage color={ "red.500" }>
             { errorMessage && errorMessage }
          </FormErrorMessage>

       </FormControl>
   );
}