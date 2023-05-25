import { Box, Button, Center, Divider, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { UserItem } from "../User-Item/User-Item.tsx";
import { RiUserSearchLine } from "react-icons/all";
import { useInputHandler } from "../../hook/use-input-handler.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { userActions, userAsyncActions } from "../../store/slice/user.slice.ts";
import { useEffect } from "react";
import { IUserBySearch } from "../../interface/user.interface.ts";
import { BUTTON_COLOR, BUTTON_HOVER_COLOR } from "../../constant/color.constant.ts";

export function FindUser( { onModalClose }: { onModalClose: () => void } ) {
   const { userBySearch } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const { value, handleChange } = useInputHandler();

   const findUser = async () => {
      if (value !== "") {
         dispatch(userAsyncActions.findUser({ userEmail: value }));
      }
   };

   useEffect(() => {
      dispatch(userActions.setUser({} as IUserBySearch));
   }, []);

   return (
       <VStack h={ 200 }>
          <Box p={ 2 }>
             <InputGroup w={ 350 }>
                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ "gray.500" }/> }/>
                <Input border={ "none" }
                       focusBorderColor={ "white" }
                       value={ value }
                       onChange={ handleChange }
                       placeholder={ "введіть e-mail користувача" }/>

                <InputRightElement w={ 130 } justifyContent={ "flex-end" }>
                   <Button onClick={ findUser } bg={ BUTTON_COLOR } color={ "white" } _hover={ { bg: BUTTON_HOVER_COLOR } }>
                      Знайти
                   </Button>
                </InputRightElement>
             </InputGroup>
          </Box>
          <Divider/>

          { Object.keys(userBySearch).length
              ?
              <Center w={ "100%" } h={ "100%" }>
                 <UserItem onModalClose={ onModalClose } user={ userBySearch }/>
              </Center>
              :
              <Center w={ "100%" }
                      h={ "100%" }>
                 <Icon as={ RiUserSearchLine }
                       boxSize={ "70px" }
                       color={ "gray.300" }/>
              </Center>
          }


       </VStack>
   );
}