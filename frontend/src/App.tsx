import { RouterProvider } from "react-router-dom";
import { UnauthorizedRouter } from "./router/Unuathorized.router.tsx";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthorizedRouter } from "./router/Authorized.router.tsx";
import { chakraTheme } from "./style/chakra.theme.ts";
import { useAppSelector } from "./hook/redux.hook.ts";

export function App() {
    const { isLogin } = useAppSelector(state => state.authReducer);

    return (
        <ChakraProvider theme={ chakraTheme }>
            <RouterProvider router={ isLogin ? AuthorizedRouter : UnauthorizedRouter }/>
        </ChakraProvider>
    );
}

