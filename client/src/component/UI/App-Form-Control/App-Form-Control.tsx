import { UseFormRegister } from "react-hook-form";
import { FormControl, FormErrorMessage, FormLabel, Input, ResponsiveValue } from "@chakra-ui/react";
import { MAIN_COLOR_LIGHTER } from "../../../constant";

interface IFormControl {
   errorMessage: string | undefined;
   labelName?: string;
   fieldName: string;
   register: UseFormRegister<any>;
   isRequired?: boolean;
   textAlign?: ResponsiveValue<any>;
}

export function AppFormControl( { errorMessage, fieldName, labelName, register, isRequired, textAlign }: IFormControl ) {

   return (
       <FormControl isInvalid={ Boolean(errorMessage) }
                    isRequired={ isRequired ? isRequired : false }
                    h={ 100 }>

          <FormLabel color={ "blackAlpha.600" }> { labelName } </FormLabel>

          <Input { ...register(fieldName) }
                 focusBorderColor={ MAIN_COLOR_LIGHTER }
                 _invalid={ { borderColor: "red.500" } }
                 textAlign={ textAlign ? textAlign : "initial" }
                 variant={ "flushed" }/>

          <FormErrorMessage color={ "red.500" }
                            justifyContent={ textAlign === "center" ? "center" : "initial" }>
             { errorMessage && errorMessage }
          </FormErrorMessage>

       </FormControl>
   );
}