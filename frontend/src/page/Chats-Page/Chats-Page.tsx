import { useEffect } from "react";

import { calc, HStack } from "@chakra-ui/react";
import { SideBar } from "../../component/Side-Bar/Side-Bar.tsx";
import { ChatBox } from "../../component/Chat-Box/Chat-Box.tsx";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { conversationAsyncActions } from "../../store/slice/conversation.slice.ts";
import { EmptyBox } from "../../component/Empty-Box/Empty-Box.tsx";
import { socketActions } from "../../store/slice/socket.slice.ts";
import { Toast } from "../../component/Toast/Toast.tsx";

export function ChatsPage() {
   const { conversations, actionMessage } = useAppSelector(state => state.conversationReducer);

   const dispatch = useAppDispatch();

   const getConversations = async () => {
      const result = await dispatch(conversationAsyncActions.getConversations({}));
      if (conversationAsyncActions.createConversation.rejected.match(result)) {
      }
   };

   useEffect(() => {
      dispatch(socketActions.connect());
      getConversations();
   }, []);

   return (
       <HStack spacing={ 0 }
               w={ "100%" }
               h={ calc("100%").subtract("150px").toString() }
               justify={ "space-between" }
               alignItems={ "flex-start" }>

          { Boolean(conversations.length) && <SideBar/> }

          { Boolean(conversations.length) ? <ChatBox/> : <EmptyBox/> }

          <Toast actionMessage={ actionMessage }/>

       </HStack>
   );
}
