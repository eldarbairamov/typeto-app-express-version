import { Avatar, Box, Divider, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { IUserFromConversation } from "../../interface/user.interface.ts";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { IConversation } from "../../interface/conversation.interface.ts";
import moment from 'moment';

interface IConversationProps {
    conversation: IConversation;
    user: IUserFromConversation;
}

export function Conversation( { user, conversation }: IConversationProps ) {

    const dispatch = useAppDispatch();

    const selectConversation = () => {
        dispatch(conversationActions.setActiveConversation({
            conversationId: user.ConversationUser.conversationId,
            username: user.username
        }));
    };

    const conversationTime = moment(+conversation.lastModified).format('HH:mm');

    return (
        <VStack width={ "100%" }>

            <VStack width={ "100%" }
                    _hover={ { bg: "gray.100", transition: '.3s' } }
                    p={ 4 }
                    rounded={ 10 }
                    spacing={ 5 }
                    onClick={ selectConversation }
                    cursor={ 'pointer' }>

                <HStack w={ "100%" }
                        justify={ "space-between" }>

                    <HStack spacing={ 5 }>

                        <Avatar name={ user.username }
                                size={ "lg" }/>

                        <VStack alignItems={ "flex-start" }
                                h={ "100%" }
                                justify={ "center" }>

                            <Heading size={ "sm" }> { user.username } </Heading>

                            <Text color={ "gray.500" }> Hi there. How are you? </Text>
                        </VStack>

                    </HStack>

                    <Box>
                        <Text>
                            { conversationTime }
                        </Text>
                    </Box>

                </HStack>
            </VStack>
            <Divider width={ 200 }/>
        </VStack>
    );
}