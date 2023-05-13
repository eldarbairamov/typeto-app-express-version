import { extendTheme } from "@chakra-ui/react";
import "@fontsource/roboto";
import "@fontsource/pt-sans-narrow";

export const chakraTheme = extendTheme({
   fonts: {
      heading: `"Roboto", sans-serif`,
      body: `"Roboto", sans-serif`
   },
   styles: {
      global: {
         "html, body": {
            fontSize: 14,
            backgroundColor: "#eff0f3",
            margin: 0,
            padding: 0,
            boxSizing: "border-box"
         },
         "&::-webkit-scrollbar": {
            height: 0,
            width: 0,
         },
         "&::-webkit-scrollbar-track": {
            height: 0,
            width: 0,
         },
         "&::-webkit-scrollbar-thumb": {
            background: "transparent",
            borderRadius: "20px",
         },
         "*": {
            letterSpacing: -0.5,
         }
      }
   },
   components: {
      Input: {
         baseStyle: {
            field: {
               _autofill: {
                  boxShadow: "0 0 0px 1000px transparent inset",
                  transition: "background-color 5000s ease-in-out 0s",
               },
            }
         }
      },
      Icon: {
         baseStyle: {
            transition: ".3s"
         }
      },
   },
});