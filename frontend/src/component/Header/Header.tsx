import { useState } from "react";

import { Highlight, HStack, Text, useDisclosure } from "@chakra-ui/react";
import { BiSearch, IoMdLogOut, FiUsers } from "react-icons/all";
import { FindUser } from "../Find-User/Find-User.tsx";
import { ContactList } from "../Contact-List/Contact-List.tsx";
import { ButtonIcon } from "../UI/Button-Icon/Button-Icon.tsx";
import { MAIN_COLOR } from "../../constant/color.constant.ts";
import { AppModal } from "../UI/App-Modal/App-Modal.tsx";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { authAsyncActions } from "../../store/slice/auth.slice.ts";
import { UnauthorizedRouter } from "../../router/Unuathorized.router.tsx";
import { UnauthorizedRoutesEnum } from "../../router/unauthorized.type.ts";
import { socketActions } from "../../store/slice/socket.slice.ts";
import { ProfileMenu } from "../Profile-Info/Profile-Menu.tsx";

export function Header() {
   const { isOpen, onOpen, onClose } = useDisclosure();
   const [ content, setContent ] = useState<JSX.Element>();

   const { currentUsername } = useAppSelector(state => state.authReducer);

   console.log(currentUsername);

   const dispatch = useAppDispatch();

   const openFindUsers = () => {
      setContent(<FindUser onModalClose={ onClose }/>);
      onOpen();
   };

   const openFriendList = () => {
      setContent(<ContactList onModalClose={ onClose }/>);
      onOpen();
   };

   const logout = async () => {
      const result = await dispatch(authAsyncActions.logout());
      if (authAsyncActions.logout.fulfilled.match(result)) {
         dispatch(socketActions.disconnect());
         UnauthorizedRouter.navigate(UnauthorizedRoutesEnum.LoginPage);
      }
   };

   return (
       <HStack w={ "95%" }
               spacing={ 0 }
               paddingTop={ 5 }
               alignItems={ "flex-start" }
               justify={ "space-between" }
               h={ "100px" }>

          <Text cursor={ "default" }
                ml={ 5 }
                fontWeight={ "bold" }
                fontSize={ 30 }>
             <Highlight query={ "to" }
                        styles={ { color: "white", p: "5px 10px", borderRadius: "10px 0 10px 10px", bg: MAIN_COLOR } }>
                typeto
             </Highlight>
          </Text>

          <HStack spacing={ 0 }>
             <ProfileMenu/>
             <ButtonIcon size={ 8 } as={ FiUsers } rounded={ 5 } color={ "gray.600" } p={ 5 } fn={ openFriendList }/>
             <ButtonIcon size={ 8 } as={ BiSearch } rounded={ 5 } color={ "gray.600" } p={ 5 } fn={ openFindUsers }/>
             <ButtonIcon size={ 8 } as={ IoMdLogOut } rounded={ 5 } color={ "gray.600" } p={ 5 } fn={ logout }/>
          </HStack>

          <AppModal isOpen={ isOpen } onClose={ onClose } content={ content }/>

       </HStack>
   );
}