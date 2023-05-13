import { Avatar, AvatarGroup, Divider, Heading, HStack, IconButton, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useAppDispatch, useAppSelector } from "../../hook/redux.hook.ts";
import { HamburgerIcon } from "@chakra-ui/icons";
import { conversationService } from "../../service/conversation.service.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { v4 } from "uuid";

export function ChatBoxHeader() {
    const dispatch = useAppDispatch();

    const { activeConversation } = useAppSelector(state => state.conversationReducer);

    const deleteConversation = async () => {
        try {
            const { data } = await conversationService.deleteConversation(activeConversation.id);
            dispatch(conversationActions.setConversations(data));
            if (data.length) dispatch(conversationActions.setActiveConversation(data[0]));

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

                { activeConversation.conversationName
                    ?
                    <AvatarGroup size="sm" max={ 2 }>
                        { activeConversation.users.map(user => <Avatar key={ v4() }
                                                                                  name={ user.username }
                                                                                  size={ "lg" }/>) }
                    </AvatarGroup>
                    :
                    <Avatar name={ activeConversation.conversationWith[0].username }
                            size={ "sm" }/>
                }
                <Heading size={ 'md' }
                         color={ 'gray.600' }>
                    { activeConversation.conversationName ? activeConversation.conversationName : activeConversation.conversationWith[0].username }
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