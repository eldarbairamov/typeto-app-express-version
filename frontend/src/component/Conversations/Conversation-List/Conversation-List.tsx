import React from "react";

import { VStack } from "@chakra-ui/react";
import { v4 } from "uuid";
import { IConversation, IUserFromConversation } from "../../../interface";
import { useAppSelector } from "../../../hook";

interface IConversationProps {
   conversation: IConversation;
   user?: IUserFromConversation;
}

interface IConversationListProps {
   Conversation: React.ComponentType<IConversationProps>;
}

export function ConversationList( { Conversation }: IConversationListProps ) {
   const { conversations } = useAppSelector(state => state.conversationReducer);

   return (
       <VStack overflow={ "scroll" }
               h={ "100%" }
               spacing={ 2 }>

          { Boolean(conversations.length) && conversations.map(conversation => {
             if (conversation.isGroupConversation) {
                return <Conversation key={ v4() }
                                     conversation={ conversation }/>;
             }
             return conversation.conversationWith.map(user => <Conversation key={ v4() }
                                                                            user={ user }
                                                                            conversation={ conversation }/>);
          }) }

       </VStack>
   );
}