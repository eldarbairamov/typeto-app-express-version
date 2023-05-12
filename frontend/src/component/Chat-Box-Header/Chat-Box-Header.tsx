import { Avatar, Divider, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { HamburgerIcon } from "@chakra-ui/icons";
import { conversationService } from "../../service/conversation.service.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { setActiveConversation } from "../../helper/set-active-conversation.helper.ts";

export function ChatBoxHeader() {
    const dispatch = useAppDispatch();

    const { activeConversation } = useAppSelector(state => state.conversationReducer);

    const deleteConversation = async () => {
        try {
            const { data } = await conversationService.deleteConversation(activeConversation.conversationId);
            dispatch(conversationActions.setConversations(data));
            if (data.length) dispatch(conversationActions.setActiveConversation(setActiveConversation(data)));

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <HStack width={ "100%" }
                h={ '60px' }
                spacing={ 0 }
                justify={ 'center' }
                style={ { position: "relative" } }>

            <HStack spacing={ 3 }>

                <Avatar name={ activeConversation.username }
                        size={ "sm" }/>

                <Heading size={ 'md' }
                         color={ 'gray.600' }>
                    { activeConversation.conversationName ? activeConversation.conversationName : activeConversation.username }
                </Heading>

            </HStack>

            <Menu>
                <MenuButton style={ { position: 'absolute', right: 30 } }
                            as={ IconButton }
                            aria-label={ 'Options' }
                            icon={ <HamburgerIcon boxSize={ 5 }/> }
                            variant={ 'outline' }/>

                <MenuList>
                    <MenuItem>
                        Очистити бесіду
                    </MenuItem>

                    <Divider/>

                    <MenuItem color={ 'orange.400' }
                              onClick={ deleteConversation }>
                        Видалити чат
                    </MenuItem>
                </MenuList>

            </Menu>

        </HStack>

    );
}