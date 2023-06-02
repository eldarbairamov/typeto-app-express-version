import { useEffect, useRef, useState } from "react";

import { IMessage } from "../interface";

export const scrollService = ( isNewMessageAdded: boolean, messages: IMessage[], onClose: () => void, onOpen: () => void ) => {

   const messageListRef = useRef<HTMLDivElement>(null);

   const [ prevStateLength, setPrevStateLength ] = useState<number>(0);

   const [ isBlindZone, setIsBlindZone ] = useState<boolean>(false);

   const scrollHandler = () => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;
      const scrollT = messageListRef.current?.scrollTop as number;

      if ((scrollH - clientH - 500) > scrollT) {
         setIsBlindZone(true);
      }

      if ((Math.ceil(scrollT) === (scrollH - clientH))) {
         setIsBlindZone(false);
      }
   };

   useEffect(() => {
      setPrevStateLength(messages.length);

      if ((messages.length > prevStateLength) && isBlindZone && !isNewMessageAdded) {
         onOpen();
      }

      if (!isBlindZone) onClose();

   }, [ messages, isBlindZone ]);

   useEffect(() => {
      const scrollH = messageListRef.current?.scrollHeight as number;
      const clientH = messageListRef.current?.clientHeight as number;

      if (!isBlindZone || isNewMessageAdded) messageListRef.current?.scrollTo({ behavior: "auto", top: scrollH - clientH });

   }, [ scrollHandler, isBlindZone ]);

   useEffect(() => {
      const scrollListener = messageListRef.current?.addEventListener("scroll", scrollHandler);
      return () => removeEventListener("scroll", scrollListener!);
   });

   return { messageListRef };

};