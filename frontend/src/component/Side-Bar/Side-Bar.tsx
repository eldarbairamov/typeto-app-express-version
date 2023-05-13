import { Box, calc, Divider, VStack } from "@chakra-ui/react";
import { SearchBar } from "../Search-Bar/Search-Bar.tsx";
import { useAppSelector } from "../../hook/redux.hook.ts";
import { Conversation } from "../Conversation/Conversation.tsx";
import { v4 } from "uuid";

export function SideBar() {
    const { conversations } = useAppSelector(state => state.conversationReducer);

    console.log(conversations);

    return (
        <VStack bg={ "white" }
                h={ calc("100vh").subtract("150px").toString() }
                spacing={ 0 }
                rounded={ 20 }>

            <SearchBar/>

            <Divider/>

            <Box
                p={ "20px 20px 0 20px" }
                alignItems={ "flex-start" }
                h={ calc("100%").subtract("60px").toString() }
                w={ "400px" }>

                <VStack overflow={ "scroll" }
                        h={ "100%" }
                        spacing={ 0 }>

                    { Boolean(conversations.length) && conversations.map(conversation => {
                        if (conversation.isGroupConversation) {
                            return <Conversation key={ v4() } conversation={ conversation }/>;
                        }
                        return conversation.conversationWith.map(user => <Conversation key={ v4() } user={ user } conversation={ conversation }/>);
                    }) }

                </VStack>

            </Box>

        </VStack>
    );
}