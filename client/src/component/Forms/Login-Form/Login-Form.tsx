import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, InputGroup, InputRightElement, VStack } from "@chakra-ui/react";
import { BUTTON_COLOR, BUTTON_HOVER_COLOR, MAIN_COLOR, MAIN_COLOR_LIGHTER } from "../../../constant";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { UnauthorizedRouter, UnauthorizedRoutesEnum } from "../../../router";
import { SubmitHandler, useForm } from "react-hook-form";
import { ILoginForm } from "../../../interface";
import { joiResolver } from "@hookform/resolvers/joi";
import { loginValidator } from "../../../validator";
import { useAppDispatch, useAppSelector, useHidePass } from "../../../hook";
import { authAsyncActions } from "../../../store/slice";

export function LoginForm() {
   const { isLoading } = useAppSelector(state => state.authReducer);

   const { register, handleSubmit, formState: { errors, isValid } } = useForm<ILoginForm>({
      resolver: joiResolver(loginValidator),
      mode: "onTouched",
   });

   const dispatch = useAppDispatch();

   const onSubmit: SubmitHandler<ILoginForm> = async ( data: ILoginForm ) => await dispatch(authAsyncActions.login({ body: data }));

   const { isShow, handleClick } = useHidePass();

   return (
       <form onSubmit={ handleSubmit(onSubmit) } noValidate={ true }>
          <VStack p={ "50px" }
                  alignItems={ "stretch" }
                  bg={ "white" }
                  boxShadow={ "xl" }
                  rounded={ 20 }
                  gap={ 5 }>

             <VStack gap={ 3 }
                     w={ 300 }>

                <FormControl isInvalid={ !!errors.email }
                             h={ 100 }>

                   <FormLabel color={ "blackAlpha.600" }> Електронна пошта </FormLabel>

                   <Input { ...register("email") }
                          focusBorderColor={ MAIN_COLOR_LIGHTER }
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
                      { errors.password && errors.password.message }
                   </FormErrorMessage>

                </FormControl>

             </VStack>

             <VStack alignItems={ "stretch" }
                     gap={ 6 }>

                <Button bg={ BUTTON_COLOR }
                        isLoading={ isLoading }
                        type={ "submit" }
                        isDisabled={ !isValid }
                        color={ "white" }
                        size={ "lg" }
                        _hover={ { bg: BUTTON_HOVER_COLOR } }>
                   Летс гоу
                </Button>

                <HStack justify={ "center" }
                        gap={ 10 }>
                   <Button variant={ "unstyled" }
                           color={ MAIN_COLOR }
                           onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.RegistrationPage) }>
                      Немає аккаунту
                   </Button>
                   <Button variant={ "unstyled" }
                           color={ MAIN_COLOR }
                           onClick={ () => UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.ForgotPasswordPage) }>
                      Забув пароль?
                   </Button>
                </HStack>

             </VStack>
          </VStack>
       </form>
   );
}