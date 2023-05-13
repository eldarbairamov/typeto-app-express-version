import { calc, HStack, VStack } from "@chakra-ui/react";
import { SideBar } from "../../component/Side-Bar/Side-Bar.tsx";
import { ChatBox } from "../../component/Chat-Box/Chat-Box.tsx";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { useEffect } from "react";
import { conversationService } from "../../service/conversation.service.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { EmptyBox } from "../../component/Empty-Box/Empty-Box.tsx";

export function ChatsPage() {
    const { conversations } = useAppSelector(state => state.conversationReducer);

    const dispatch = useAppDispatch();

    const getConversations = async () => {
        try {
            const { data } = await conversationService.getConversations();

            if (data.length) {
                dispatch(conversationActions.setConversations(data));
                dispatch(conversationActions.setActiveConversation(data[0]));
            }

        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getConversations();
    }, []);


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

            </HStack>

        </VStack>
    );
}
