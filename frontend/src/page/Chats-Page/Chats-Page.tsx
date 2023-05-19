import { calc, HStack, useToast, VStack } from "@chakra-ui/react";
import { SideBar } from "../../component/Side-Bar/Side-Bar.tsx";
import { ChatBox } from "../../component/Chat-Box/Chat-Box.tsx";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { useEffect, useState } from "react";
import { conversationActions, conversationAsyncActions } from "../../store/slice/conversation.slice.ts";
import { EmptyBox } from "../../component/Empty-Box/Empty-Box.tsx";
import { socketActions } from "../../store/slice/socket.slice.ts";

export function ChatsPage() {
   const { conversations, actionMessage } = useAppSelector(state => state.conversationReducer);

   const toast = useToast();

   const [ activateToast, setActivateToast ] = useState<boolean>(false);

   const dispatch = useAppDispatch();

   const getConversations = async () => {
      const result = await dispatch(conversationAsyncActions.getConversations({}));
      if (conversationAsyncActions.createConversation.rejected.match(result)) {
         console.log(result.payload);
      }
   };

   useEffect(() => {
      getConversations();
      dispatch(socketActions.connect());
   }, []);

   useEffect(() => {
      actionMessage && setActivateToast(true);
   }, [ actionMessage ]);


   return (
       <VStack w={ "100%" }
               spacing={ 0 }
               gap={ "20px" }
               h={ calc("100vh").subtract("100px").toString() }>

          <HStack h={ calc("100%").subtract("80px").toString() }
                  spacing={ 0 }
                  w={ "100%" }
                  justify={ "space-between" }
                  alignItems={ "flex-start" }>
             <SideBar/>

             { Boolean(conversations.length) ? <ChatBox/> : <EmptyBox/> }

             { (activateToast && actionMessage) && toast({
                description: actionMessage,
                colorScheme: "blue",
                status: "info",
                duration: 1500,
                position: "top",
                onCloseComplete: () => {
                   dispatch(conversationActions.setActionMessage(undefined));
                   setActivateToast(false);
                }
             }) }

          </HStack>

       </VStack>
   );
}
