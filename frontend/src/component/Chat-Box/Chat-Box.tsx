import { Box, Button, calc, Divider, HStack, Textarea, VStack } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { SiTelegram } from "react-icons/all";
import { ChatBoxHeader } from "../Chat-Box-Header/Chat-Box-Header.tsx";

export function ChatBox() {

    return (
        <VStack h={ calc("100vh").subtract("150px").toString() }
                rounded={ 20 }
                bg={ "white" }
                w={ calc("100%").subtract("450px").toString() }
                spacing={ 0 }>

            <ChatBoxHeader/>

            <Divider/>

            <VStack h={ calc("100%").subtract("60px").toString() }
                    w={ "100%" }
                    spacing={ 0 }>

                <VStack h={ calc("100%").subtract("100px").toString() }
                        spacing={ 10 }
                        p={ "20px 20px 0 20px" }
                        overflow={ "scroll" }
                        w={ "100%" }>

                </VStack>

                <Divider/>

                <HStack h={ "100px" }
                        justify={ "center" }
                        w={ "100%" }>
                    <Box w={ "60%" }
                         bg={ "#eff0f3" }
                         rounded={ 20 }
                         padding={ 3 }>

                        <Textarea rows={ 1 }
                                  resize={ "none" }
                                  bg={ "#eff0f3" }
                                  wordBreak={ "break-word" }
                                  border={ "none" }
                                  focusBorderColor={ "transparent" }
                                  placeholder={ "Написати..." }/>

                    </Box>

                    <Button bg={ "transparent" }
                            height={ "50px" }
                            color={ "white" }
                            _hover={ { bg: "transparent" } }>

                        <Icon as={ SiTelegram }
                              _hover={ { color: "orange.500" } }
                              boxSize={ "50px" }
                              color={ "orange.400" }/>

                    </Button>
                </HStack>

            </VStack>
        </VStack>
    );
}