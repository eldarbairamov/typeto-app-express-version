import { MAGENTA } from "../constant";
import { ConversationUser, User } from "../model";
import { Op } from "sequelize";
import { Server, Socket } from "socket.io";

interface ITypingHandler {
   socket: Socket;
   io: Server;
   getUsers: ( userIds: number[] ) => (string | null)[];
}

export default ( { io, socket, getUsers }: ITypingHandler ) => {

   socket.on( "typing", async ( conversationId: number, whoTypingId: number ) => {
      console.log( MAGENTA, "socket: typing" );

      const conversationWith = await ConversationUser.findAll( {
         where: {
            conversationId,
            userId: {
               [Op.ne]: whoTypingId
            }
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const whoTyping = await User.findByPk( whoTypingId );

      const to = getUsers( conversationWith ) as string[];
      to.length && io.to( to ).emit( "someone_is_typing", conversationId, whoTyping?.username );
   } );

   socket.on( "stop_typing", async ( conversationId: number, whoIsTypingId: number ) => {
      console.log( MAGENTA, "socket: stop_typing" );

      const conversationWith = await ConversationUser.findAll( {
         where: {
            conversationId,
            userId: {
               [Op.ne]: whoIsTypingId
            }
         },
      } )
          .then( conversationUser => conversationUser.map( c => c.userId ) );

      const whoIsTyping = await User.findByPk( whoIsTypingId );

      const to = getUsers( conversationWith ) as string[];
      to.length && io.to( to ).emit( "someone_is_stop_typing", conversationId, whoIsTyping?.username );
   } );

}