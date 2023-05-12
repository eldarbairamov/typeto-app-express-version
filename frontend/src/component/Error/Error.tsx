import { useRouteError } from "react-router-dom";
import { Center, HStack, Text, Divider } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { BsEmojiSmileUpsideDown } from "react-icons/all";

export function Error() {
    const error = useRouteError();

    console.log(error);

    return (
        <Center h={ "100vh" }
                bg={ 'blackAlpha.900' }>

            <HStack spacing={ 6 }>
                <Icon as={ BsEmojiSmileUpsideDown }
                      boxSize={ "40px" }
                      color={ 'white' }/>

                <Divider orientation={ 'vertical' }
                         h={ 10 }
                         borderWidth={ 1 }
                         borderColor={ 'white' }/>

                <Text fontSize={ 25 }
                      color={ 'white' }>
                    Something goes wrong.
                </Text>
            </HStack>

        </Center>
    );
}