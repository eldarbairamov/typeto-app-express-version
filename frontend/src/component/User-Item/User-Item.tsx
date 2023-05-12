import { Avatar, Button, Heading, HStack } from "@chakra-ui/react";
import { IUserBySearch } from "../../interface/user.interface.ts";
import { Icon } from "@chakra-ui/icons";
import { AiOutlineMessage, FiUserPlus, FiUserCheck } from "react-icons/all";
import { userService } from "../../service/user.service.ts";
import { useAppDispatch } from "../../hook/redux.hook.ts";
import { conversationService } from "../../service/conversation.service.ts";
import { conversationActions } from "../../store/slice/conversation.slice.ts";
import { useState } from "react";

interface IUserItemProps {
    user: IUserBySearch,
    onModalClose: () => void
}

export function UserItem( { user, onModalClose }: IUserItemProps ) {
    const [ isAdded, setIsAdded ] = useState<boolean>(user.isAlreadyAdded);

    const dispatch = useAppDispatch();

    const addContact = async () => {
        try {
            await userService.addContact(user.id);
            setIsAdded(true);
        } catch (e) {
            console.log(e);
        }
    };

    const createConversation = async () => {
        try {
            const { data } = await conversationService.createConversation(user.id);
            dispatch(conversationActions.createConversation(data));

            dispatch(conversationActions.setActiveConversation({
                conversationId: data.id,
                username: user.username
            }));

            onModalClose();

        } catch (e) {
            console.log(e);
        }
    };

    return (
        <HStack w={ "85%" }
                spacing={ 5 }
                justify={ "space-between" }>

            <HStack spacing={ 5 }>
                <Avatar name={ user.username }
                        size={ "md" }/>
                <Heading size={ "md" }> { user.username } </Heading>
            </HStack>

            <HStack spacing={ 1 }>

                <Button variant={ "unstyled" }
                        display={ "flex" }
                        onClick={ createConversation }
                        alignItems={ "center" }>
                    <Icon as={ AiOutlineMessage }
                          boxSize={ "25px" }
                          color={ "gray.600" }/>
                </Button>

                <Button variant={ "unstyled" }
                        cursor={ isAdded ? 'default' : 'pointer' }
                        display={ "flex" }
                        onClick={ isAdded ? undefined : addContact }
                        alignItems={ "center" }>
                    <Icon as={ isAdded ? FiUserCheck : FiUserPlus }
                          boxSize={ "25px" }
                          color={ "gray.600" }/>
                </Button>

            </HStack>

        </HStack>
    );
}