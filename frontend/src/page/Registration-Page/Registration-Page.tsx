import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Highlight, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useHidePass } from "../../hook/use-hide-pass.hook.ts";
import { UnauthorizedRouter } from "../../router/Unuathorized.router.tsx";
import { UnauthorizedRoutesEnum } from "../../router/unauthorized.type.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { IRegistrationForm } from "../../interface/form.interface.ts";
import { joiResolver } from "@hookform/resolvers/joi";
import { registrationValidator } from "../../validator/auth.validator.ts";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { authAsyncActions } from "../../store/slice/auth.slice.ts";

export function RegistrationPage() {
   const { register, handleSubmit, formState: { errors, isValid } } = useForm<IRegistrationForm>({
      resolver: joiResolver(registrationValidator),
      mode: "onTouched",
   });

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<IRegistrationForm> = async ( data: IRegistrationForm ) => {
      const result = await dispatch(authAsyncActions.registration({ data }));
      if (authAsyncActions.registration.fulfilled.match(result)) {
         UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.LoginPage);
      }
   };

   const { isShow, handleClick } = useHidePass();

   return (
       <Center height={ "100vh" } gap={ 100 } flexDirection={ { base: "column", md: "row" } }>
          <Heading size={ "4xl" }>
             <Highlight query={ "to" } styles={ { p: "2px 15px", rounded: "lg", bg: "purple.300", color: "white" } }>
                typeto
             </Highlight>
          </Heading>

          <form onSubmit={ handleSubmit(onSubmit) }
                noValidate={ true }>
             <VStack p={ "50px" }
                     alignItems={ "stretch" }
                     bg={ "white" }
                     rounded={ 20 }
                     gap={ 5 }>
                <VStack gap={ 3 }
                        w={ 300 }>
                   <FormControl isRequired={ true }
                                isInvalid={ !!errors.username }
                                height={ 100 }>
                      <FormLabel color={ "blackAlpha.600" }> Імʼя користувача </FormLabel>
                      <Input { ...register("username") }
                             focusBorderColor={ "purple.100" }
                             _invalid={ { borderColor: "red.500" } }
                             variant={ "flushed" }/>
                      <FormErrorMessage color={ "red.500" }>
                         { errors.username && errors.username.message }
                      </FormErrorMessage>
                   </FormControl>

                   <FormControl isRequired={ true }
                                isInvalid={ !!errors.email }
                                height={ 100 }>
                      <FormLabel color={ "blackAlpha.600" }> Електронна пошта </FormLabel>
                      <Input { ...register("email") }
                             focusBorderColor={ "purple.100" }
                             _invalid={ { borderColor: "red.500" } }
                             variant={ "flushed" }/>
                      <FormErrorMessage color={ "red.500" }>
                         { errors.email && errors.email.message }
                      </FormErrorMessage>
                   </FormControl>

                   <FormControl isRequired={ true }
                                isInvalid={ !!errors.password }
                                height={ 100 }>
                      <FormLabel color={ "blackAlpha.600" }> Пароль </FormLabel>
                      <InputGroup>
                         <Input { ...register("password") }
                                focusBorderColor={ "purple.100" }
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
                         { errors.password && errors.password.message }
                      </FormErrorMessage>
                   </FormControl>
                </VStack>

                <VStack alignItems={ "stretch" }
                        gap={ 6 }>
                   <Button bg={ "purple.300" }
                           type={ "submit" }
                           isDisabled={ !isValid }
                           color={ "white" }
                           size={ "lg" }
                           _hover={ { bg: "purple.400" } }>
                      Зареєструватись
                   </Button>
                   <Button variant={ "unstyled" }
                           color={ "purple.300" }
                           onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.LoginPage) }>
                      Увійти
                   </Button>
                </VStack>
             </VStack>
          </form>
       </Center>
   );
}
