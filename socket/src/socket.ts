import { Server, Socket } from "socket.io";
import { config } from "./config";
import { sessionManagerService } from "./service";
import { GREEN_COLOR, MAGENTA, RED_COLOR } from "./constant";

import registerAddUserHandler from "./handler/add-user.handler"
import registerConversationHandler from "./handler/conversation.handler"
import registerMessageHandler from "./handler/message.handler"
import registerTypingHandler from "./handler/typing.handler"

const io = new Server( 3200, { cors: { origin: config.CLIENT_URL } } );

const { users, getUser, addUser, getUsers, removeUser } = sessionManagerService()

export const startSocket = () => {

   io.on( "connection", ( socket: Socket ) => {
      console.log( MAGENTA, "socket: connection" );
      console.log( GREEN_COLOR, "user " + socket.id + " is connected" );

      registerAddUserHandler( { io, addUser, users, socket } )

      registerConversationHandler( { socket, io, getUser, getUsers } )

      registerMessageHandler( { io, socket, getUsers } )

      registerTypingHandler( { socket, io, getUsers } )

      socket.on( "disconnect", () => {
         console.log( MAGENTA, "socket: disconnect" );
         console.log( RED_COLOR, "user " + socket.id + " is disconnected" );
         removeUser( socket.id );
         io.emit( "refresh_online_users", users.map( u => u.userId ) );
      } );

   } );
};