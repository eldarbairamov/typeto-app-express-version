import { useEffect, useState } from "react";

import { Center, Divider, Input, InputGroup, InputLeftElement, VStack, Box, HStack, Avatar, Heading, Button } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { RiUserSearchLine } from "react-icons/all";
import { v4 } from "uuid";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { userActions, userAsyncActions } from "../../store/slice/user.slice.ts";
import { ContactItem } from "../Contact-Item/Contact-Item.tsx";
import { conversationActions, conversationAsyncActions } from "../../store/slice/conversation.slice.ts";
import { IUser } from "../../interface/user.interface.ts";
import { TypedOnChange } from "../../interface/common.interface.ts";

export function GroupConversationMenu( { isOnlyMessage, onModalClose }: { isOnlyMessage?: boolean, onModalClose: () => void } ) {
   const [ values, setValues ] = useState<{ searchValue: string, groupName: string }>({
      searchValue: '',
      groupName: ''
   });

   const handleChange = ( e: TypedOnChange, fieldName: string ) => {
      setValues({
         ...values,
         [fieldName]: e.target.value
      });
   };

   const { groupMembers } = useAppSelector(state => state.conversationReducer);

   const { contacts } = useAppSelector(state => state.userReducer);

   const dispatch = useAppDispatch();

   useEffect(() => {
      dispatch(userAsyncActions.getContacts({ searchKey: values.searchValue }));
   }, [ values.searchValue ]);

   useEffect(() => {
      dispatch(conversationActions.resetGroupMembers());
   }, []);

   const deleteContactFromGroup = ( member: IUser ) => {
      dispatch(conversationActions.deleteContactFromGroup({ id: member.id }));
      dispatch(userActions.groupModeMove({ id: member.id, action: 'delete', user: member }));
   };

   const createGroupConversation = async () => {
      const ids = groupMembers.map(member => member.id);

      const result = await dispatch(conversationAsyncActions.createConversation({ userIds: ids, conversationName: values.groupName }));
      if (conversationAsyncActions.createConversation.fulfilled.match(result)) {
         onModalClose && onModalClose();
      }
   };

   return (
       <VStack h={ 650 }>

          <VStack spacing={ 5 }
                  p={ 5 }
                  w={ '100%' }>

             { Boolean(!groupMembers.length)
                 ?
                 <Heading size={ 'md' }> Оберіть учасників </Heading>
                 :

                 <VStack spacing={ 7 }>
                    <Heading size={ 'md' }> Учасники </Heading>

                    <HStack>
                       { groupMembers && groupMembers.map(member =>
                           <Avatar cursor={ 'pointer' }
                                   key={ v4() }
                                   size={ 'sm' }
                                   name={ member.username }
                                   onClick={ () => deleteContactFromGroup(member) }/>
                       ) }
                    </HStack>
                 </VStack>
             }

          </VStack>


          <Box p={ 2 }>
             <InputGroup w={ 350 }>
                <InputLeftElement pointerEvents={ "none" }
                                  children={ <Search2Icon color={ "gray.500" }/> }/>
                <Input border={ "none" }
                       focusBorderColor={ "white" }
                       value={ values.searchValue }
                       onChange={ ( e ) => handleChange(e, 'searchValue') }
                       placeholder={ "знайти контакт" }/>
             </InputGroup>
          </Box>

          <Divider/>

          { contacts
              ?
              <VStack w={ "100%" }
                      h={ '100%' }
                      paddingTop={ 5 }
                      spacing={ 5 }
                      overflow={ "scroll" }>

                 { contacts.map(user => <ContactItem key={ v4() }
                                                     onModalClose={ onModalClose }
                                                     isOnlyForAdding={ true }
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

          <VStack w={ '100%' }
                  h={ 200 }>

             <Input w={ '70%' }
                    variant={ 'flushed' }
                    h={ 12 }
                    fontSize={ 16 }
                    fontWeight={ 700 }
                    value={ values.groupName }
                    onChange={ ( e ) => handleChange(e, 'groupName') }
                    textAlign={ 'center' }
                    focusBorderColor={ "white" }
                    placeholder={ 'введіть назву бесіди' }/>

             <Button size={ 'lg' }
                     bg={ 'orange.200' }
                     rounded={ 10 }
                     onClick={ createGroupConversation }
                     _hover={ { bg: 'orange.300' } }
                     isDisabled={ !groupMembers.length || values.groupName == '' }
                     w={ '80%' }>
                Створити
             </Button>

          </VStack>


       </VStack>
   );
}