import { MAGENTA } from "../constant";
import { deleteMessageService, sendMessageService } from "../service";
import { IMessage } from "../interface";
import { Server, Socket } from "socket.io";

interface IMessageHandler {
   socket: Socket;
   getUsers: ( userIds: number[] ) => (string | null)[];
   io: Server;
}

export default ( { io, socket, getUsers }: IMessageHandler ) => {

   socket.on( "delete_message", async ( messageId: number, conversationId: number, currentUserId: number ) => {
      console.log( MAGENTA, "socket: delete_message" );

      const { conversationWith, updatedLastMessage } = await deleteMessageService( conversationId, currentUserId );
      const to = getUsers( conversationWith ) as string[];

      if ( to.length ) io.to( to ).emit( "delete_message_result", messageId, conversationId, updatedLastMessage );
   } );

   socket.on( "send_message", async ( message: IMessage ) => {
      console.log( MAGENTA, "socket: send_message" );

      const { conversationForSender, conversationForReceiver, users } = await sendMessageService( message );

      const to = getUsers( users! ) as string[];
      io.to( to ).emit( "get_message", message, conversationForSender, conversationForReceiver );
   } );

}