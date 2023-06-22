import { Server, Socket } from "socket.io";
import { MAGENTA } from "../constant";
import { ISocketUser } from "../interface";

interface IAddUserHandler {
   socket: Socket;
   io: Server;
   addUser: ( userId: number, socketId: string ) => void
   users: ISocketUser[]
}

export default ( { io, addUser, users, socket }: IAddUserHandler ) => {

   socket.on( "add_user", ( userId: number ) => {
      console.log( MAGENTA, "socket: add_user" );

      addUser( userId, socket.id );

      io.emit( "who_is_online", users.map( u => u.userId ) );
   } );

}