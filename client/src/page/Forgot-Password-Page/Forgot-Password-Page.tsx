import { Button, Center, Container, FormControl, FormErrorMessage, Heading, Highlight, Input, VStack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import { emailValidator } from "../../validator";
import { axiosInstance } from "../../service";

export function ForgotPasswordPage() {
   const { register, handleSubmit, formState: { errors, isValid } } = useForm<{ email: string }>({
      resolver: joiResolver(emailValidator),
      mode: "onTouched",
   });

   const onSubmit: SubmitHandler<{ email: string }> = async ( data: { email: string } ) => axiosInstance.post("/auth/forgot_password", data);

   return (
       <Center h={ "100vh" } flexDirection={ "column" } gap={ 20 }>
          <Heading size={ "4xl" }>
             <Highlight query={ "to" } styles={ { color: "white", p: "2px 15px", rounded: "lg", bg: "green.400" } }>
                typeto
             </Highlight>
          </Heading>

          <VStack bg={ "white" }
                  p={ "50px" }
                  spacing={ 10 }
                  rounded={ 20 }>

             <Container width={ 600 }>
                <Heading size={ "md" } textAlign={ "center" } color={ "blackAlpha.600" }>
                   Введіть адресу електронної пошти вашого аккаунту і ми пришлемо вам посилання на скидання пароля
                </Heading>
             </Container>

             <form onSubmit={ handleSubmit(onSubmit) } noValidate={ true }>
                <VStack alignItems={ "stretch" }
                        spacing={ 0 }
                        w={ 300 }>
                   <FormControl isRequired={ true }
                                isInvalid={ !!errors.email }
                                width={ 300 }
                                height={ 100 }>
                      <Input { ...register("email") }
                             focusBorderColor={ "green.100" }
                             textAlign={ "center" }
                             _invalid={ { borderColor: "red.500" } }
                             variant={ "flushed" }/>
                      <FormErrorMessage color={ "red.500" }
                                        display={ "flex" }
                                        justifyContent={ "center" }>
                         { errors.email && errors.email.message }
                      </FormErrorMessage>
                   </FormControl>

                   <Button bg={ "green.400" }
                           type={ "submit" }
                           isDisabled={ !isValid }
                           color={ "white" }
                           size={ "lg" }
                           _hover={ { bg: "green.300" } }>
                      Відправити
                   </Button>
                </VStack>
             </form>

          </VStack>
       </Center>
   );
}