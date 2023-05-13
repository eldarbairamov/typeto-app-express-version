import { Box, Button, Center, Divider, Input, InputGroup, InputLeftElement, InputRightElement, VStack } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { UserItem } from "../User-Item/User-Item.tsx";
import { userService } from "../../service/user.service.ts";
import { RiUserSearchLine } from "react-icons/all";
import { useInputHandler } from "../../hook/use-input-handler.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { userActions } from "../../store/slice/user.slice.ts";
import { useEffect } from "react";
import { IUserBySearch } from "../../interface/user.interface.ts";

export function FindUser( { onModalClose }: { onModalClose: () => void } ) {
   const { userBySearch } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   const { value, handleChange } = useInputHandler();

   const findUser = async () => {
      if (value !== "") {
         try {
            const { data } = await userService.findUser(value);
            dispatch(userActions.setUser(data));
         } catch (e) {
            console.log(e);
         }
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
                   <Button onClick={ findUser } bg={ "orange.100" } _hover={ { bg: "orange.200" } }>
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