import { Button, Center, FormControl, FormErrorMessage, FormLabel, Heading, Highlight, HStack, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useHidePass } from "../../hook/use-hide-pass.hook.ts";
import { UnauthorizedRouter } from "../../router/Unuathorized.router.tsx";
import { UnauthorizedRoutesEnum } from "../../router/unauthorized.type.ts";
import { SubmitHandler, useForm } from "react-hook-form";
import { ILoginForm } from "../../interface/form.interface.ts";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginValidator } from "../../validator/auth.validator.ts";
import { authService } from "../../service/auth.service.ts";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { authActions } from "../../store/slice/auth.slice.ts";

export function LoginPage() {
   const { register, handleSubmit, formState: { errors, isValid } } = useForm<ILoginForm>({
      resolver: joiResolver(loginValidator),
      mode: "onTouched",
   });

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<ILoginForm> = async ( data: ILoginForm ) => {
      await authService.login(data, ( response ) => dispatch(authActions.setUserInfo(response)));
   };

   const { isShow, handleClick } = useHidePass();

   return (
       <Center h={ "100vh" } gap={ 100 } flexDirection={ { base: "column", md: "row" } }>
          <Heading size={ "4xl" }>
             <Highlight query={ "to" } styles={ { color: "white", p: "2px 15px", rounded: "lg", bg: "red.300" } }>
                typeto
             </Highlight>
          </Heading>

          <form onSubmit={ handleSubmit(onSubmit) } noValidate={ true }>
             <VStack p={ "50px" }
                     alignItems={ "stretch" }
                     bg={ "white" }
                     rounded={ 20 }
                     gap={ 5 }>
                <VStack gap={ 3 }
                        w={ 300 }>
                   <FormControl isInvalid={ !!errors.email }
                                h={ 100 }>
                      <FormLabel color={ "blackAlpha.600" }> Електронна пошта </FormLabel>
                      <Input { ...register("email") }
                             focusBorderColor={ "red.100" }
                             _invalid={ { borderColor: "red.500" } }
                             variant={ "flushed" }/>
                      <FormErrorMessage color={ "red.500" }>
                         { errors.email && errors.email.message }
                      </FormErrorMessage>
                   </FormControl>

                   <FormControl isInvalid={ !!errors.password }
                                h={ 100 }>
                      <FormLabel color={ "blackAlpha.600" }> Пароль </FormLabel>
                      <InputGroup>
                         <Input { ...register("password") }
                                focusBorderColor={ "red.100" }
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
                   <Button bg={ "red.300" }
                           type={ "submit" }
                           isDisabled={ !isValid }
                           color={ "white" }
                           size={ "lg" }
                           _hover={ { bg: "red.300" } }>
                      Летс гоу
                   </Button>

                   <HStack justify={ "center" }
                           gap={ 10 }>
                      <Button variant={ "unstyled" }
                              color={ "red.300" }
                              onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.RegistrationPage) }>
                         Немає аккаунту
                      </Button>
                      <Button variant={ "unstyled" }
                              color={ "red.300" }
                              onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.ForgotPasswordPage) }>
                         Забув пароль?
                      </Button>
                   </HStack>
                </VStack>
             </VStack>
          </form>

       </Center>
   );
}
