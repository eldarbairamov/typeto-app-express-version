import { Heading, Highlight } from "@chakra-ui/react";

export function Logo( { color }: { color: string } ) {
   return (
       <Heading size={ "4xl" }>

          <Highlight query={ "to" } styles={ {
             color: "white",
             marginLeft: 1,
             p: "2px 15px",
             borderRadius: "15px 0 15px 15px",
             bg: color
          } }>
             typeto
          </Highlight>

       </Heading>
   );
}