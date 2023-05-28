import { Header } from "../component/Header/Header.tsx";
import { Center, VStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hook/redux.hook.ts";
import { conversationAsyncActions } from "../store/slice/conversation.slice.ts";
import { userAsyncActions } from "../store/slice/user.slice.ts";
import { useEffect } from "react";
import { socketActions } from "../store/slice/socket.slice.ts";

export function MainLayout() {
   const { searchKey } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const getConversations = async () => await dispatch(conversationAsyncActions.getConversations({ searchKey }));
   const getCurrentUser = async () => await dispatch(userAsyncActions.getCurrentUser());

   useEffect(() => {
      dispatch(socketActions.connect());
      getCurrentUser();
   }, []);

   useEffect(() => {
      getConversations();
   }, [ searchKey ]);

   return (
       <Center w={ [ "800px", "100%", "100%", "100%", "100%" ] }>
          <VStack w={ "90%" }
                  h={ "100vh" }
                  spacing={ 0 }>
             <Header/>
             <Outlet/>
          </VStack>
       </Center>
   );

}