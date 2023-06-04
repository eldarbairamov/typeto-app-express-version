import React, { useRef, useState } from "react";

import { Center, Divider, Input, InputGroup, InputLeftElement, VStack, Box, HStack, Avatar, Heading, Button } from "@chakra-ui/react";
import { Icon, Search2Icon } from "@chakra-ui/icons";
import { RiUserSearchLine } from "react-icons/all";
import { v4 } from "uuid";
import { useAppSelector } from "../../hook";
import { TypedOnChange } from "../../interface";
import { groupConvMenuService } from "../../service";
import { ContactItem } from "../Contacts";
import { BUTTON_COLOR, BUTTON_HOVER_COLOR } from "../../constant";
import { getImageUrl } from "../../helper";

export function GroupConversationMenu( { isOnlyMessage, onModalClose }: { isOnlyMessage?: boolean, onModalClose: () => void } ) {
   const { groupMembers } = useAppSelector(state => state.conversationReducer);

   const { contacts } = useAppSelector(state => state.userReducer);

   const [ values, setValues ] = useState<{ searchValue: string, groupName: string }>({
      searchValue: "",
      groupName: ""
   });

   const handleChange = ( e: TypedOnChange, fieldName: string ) => {
      setValues({
         ...values,
         [fieldName]: e.target.value
      });
   };

   const ref = useRef<HTMLButtonElement>(null);

   const { createGroupConversation, deleteContactFromGroup } = groupConvMenuService(onModalClose, values);

   const onEnterDown = async ( e: React.KeyboardEvent<HTMLInputElement> ) => {
      if (e.key === "Enter") {
         e.preventDefault();
         ref.current?.click();
      }
   };

   return (
       <VStack h={ 650 }>

          <VStack spacing={ 5 }
                  p={ 5 }
                  w={ "100%" }>

             { Boolean(!groupMembers.length)
                 ? <Heading size={ "md" }> Оберіть учасників </Heading>

                 : <VStack spacing={ 7 }>
                    <Heading size={ "md" }> Учасники </Heading>

                    <HStack>
                       { groupMembers && groupMembers.map(member =>
                           <Avatar cursor={ "pointer" }
                                   key={ v4() }
                                   src={ getImageUrl(member.image, member.email) }
                                   size={ "sm" }
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
                       onChange={ ( e ) => handleChange(e, "searchValue") }
                       placeholder={ "знайти контакт" }/>
             </InputGroup>
          </Box>

          <Divider/>

          { contacts
              ? <VStack w={ "100%" }
                        h={ "100%" }
                        paddingTop={ 5 }
                        spacing={ 5 }
                        overflow={ "scroll" }>

                 { contacts.map(user => <ContactItem key={ v4() }
                                                     onModalClose={ onModalClose }
                                                     isOnlyForAdding={ true }
                                                     user={ user }
                                                     canDelete={ !isOnlyMessage }/>) }

              </VStack>

              : <Center w={ "100%" }
                        h={ "100%" }>

                 <Icon as={ RiUserSearchLine }
                       boxSize={ "70px" }
                       color={ "gray.300" }/>

              </Center>
          }

          <VStack w={ "100%" }
                  h={ 200 }>

             <Input w={ "70%" }
                    variant={ "flushed" }
                    h={ 12 }
                    fontSize={ 16 }
                    fontWeight={ 700 }
                    onKeyDown={ onEnterDown }
                    value={ values.groupName }
                    onChange={ ( e ) => handleChange(e, "groupName") }
                    textAlign={ "center" }
                    focusBorderColor={ "white" }
                    placeholder={ "введіть назву бесіди" }/>

             <Button size={ "lg" }
                     rounded={ 10 }
                     ref={ ref }
                     bg={ BUTTON_COLOR }
                     color={ "white" }
                     _hover={ { bg: BUTTON_HOVER_COLOR } }
                     onClick={ createGroupConversation }
                     isDisabled={ !groupMembers.length || values.groupName == "" }
                     w={ "80%" }>
                Створити
             </Button>

          </VStack>


       </VStack>
   );
}