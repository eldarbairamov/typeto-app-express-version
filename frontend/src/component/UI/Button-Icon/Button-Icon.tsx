import { Button, ComponentWithAs } from "@chakra-ui/react";
import { Icon, IconProps } from "@chakra-ui/icons";
import { CSSProperties } from "react";

interface IIconProps {
   size: number;
   as: ComponentWithAs<"svg", IconProps>;
   fn?: () => void;
   bg?: string;
   color?: string;
   rounded?: number;
   p?: number | string;
   style?: CSSProperties;
}

export function ButtonIcon( { size, as, fn, bg, color, rounded, p, style }: IIconProps ) {
   return (
       <Button variant={ "ghost" }
               style={ style }
               rounded={ rounded ? rounded : 20 }
               gap={ 5 }
               p={ p }
               bg={ bg }
               _hover={ { bg: "transparent" } }
               onClick={ fn }>

          <Icon as={ as }
                boxSize={ size }
                cursor={ "pointer" }
                color={ color }/>

       </Button>
   );
}