import { useEffect } from "react";

import { Center, Divider, Input, InputGroup, InputLeftElement, VStack, Box } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { RiUserSearchLine } from "react-icons/all";
import { v4 } from "uuid";
import { useInputHandler } from "../../hook/use-input-handler.ts";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import {  userAsyncActions } from "../../store/slice/user.slice.ts";
import { ContactItem } from "../Contact-Item/Contact-Item.tsx";

export function ContactList( { isOnlyMessage, onModalClose }: { isOnlyMessage?: boolean, onModalClose: () => void } ) {
   const { value, handleChange } = useInputHandler();

   const { contacts } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(userAsyncActions.getContacts({ searchKey: value }));
   }, [ value ]);

   return (
       <VStack h={ 500 }>

          <Box p={ 2 }>
             <InputGroup w={ 350 }>
                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ "gray.500" }/> }/>
                <Input border={ "none" }
                       focusBorderColor={ "white" }
                       value={ value }
                       onChange={ handleChange }
                       placeholder={ "знайти контакт" }/>
             </InputGroup>
          </Box>

          <Divider/>

          { contacts
              ?
              <VStack w={ "100%" }
                      paddingTop={ 5 }
                      spacing={ 5 }
                      overflow={ "scroll" }>

                 { contacts.map(user => <ContactItem key={ v4() }
                                                     onModalClose={ onModalClose }
                                                     user={ user }
                                                     canDelete={ !isOnlyMessage }/>) }

              </VStack>
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