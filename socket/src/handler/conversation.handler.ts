import { CYAN_COLOR, MAGENTA } from "../constant";
import { createConversationService, kickUserService, leaveGroupConversationService } from "../service";
import { Server, Socket } from "socket.io";

interface IConversationHandler {
   socket: Socket;
   io: Server;
   getUser: ( userId: number ) => (string | undefined);
   getUsers: ( userIds: number[] ) => (string | null)[]
}

export default ( { socket, io, getUser, getUsers }: IConversationHandler ) => {

   socket.on( "join_to_conversation", ( conversationId: number ) => {
      console.log( MAGENTA, "socket: join to conversation" );

      socket.join( String( conversationId ) );

      console.log( CYAN_COLOR, "user " + socket.id + " joined to conversation: " + conversationId );
   } );

   socket.on( "create_conversation", async ( conversationId: number, whoCreatedId: number, conversationWith: number[] ) => {
      console.log( MAGENTA, "socket: create_conversation" );

      const conversation = await createConversationService( conversationId, whoCreatedId );

      if ( !conversation.isGroupConversation ) {
         const to = String( getUser( conversationWith[0] ) );
         io.to( to ).emit( "get_conversation", conversation );
      }
      else {
         const to = getUsers( conversation.users.map( u => u.id ) ) as string[];
         socket.to( to ).emit( "get_conversation", conversation );
      }
   } );

   socket.on( "delete_conversation", async ( conversationId: number, conversationWith: number, whoDeleted: { id: number, username: string } ) => {
      console.log( MAGENTA, "socket: delete_conversation" );

      const to = String( getUser( conversationWith ) );
      io.to( to ).emit( "get_delete_result", conversationId, whoDeleted.username );
   } );

   socket.on( "leave_group_conversation", async ( conversationId: number, conversationWith: number[], whoLeft: string ) => {
      console.log( MAGENTA, "socket: leave_group_conversation" );

      const conversation = await leaveGroupConversationService( conversationId );

      const to = getUsers( conversationWith ) as string[];
      io.to( to ).emit( "get_leave_result", conversation, whoLeft );
   } );

   socket.on( "delete_group_conversation", ( conversationWith: number[], conversationId: number, adminName: string ) => {
      console.log( MAGENTA, "socket: delete_group_conversation" );

      const to = getUsers( conversationWith ) as string[];
      if ( to.length ) io.to( to ).emit( "get_delete_group_result", conversationId, adminName );
   } );

   socket.on( "kick_user_from_group_conversation", async ( conversationId: number, whoWasKickedId: number, adminId: number ) => {
      console.log( MAGENTA, "socket: kick_user_from_group_conversation" );

      const { whoIsAdmin, whoWillSeeChanges, conversation } = await kickUserService( conversationId, whoWasKickedId, adminId );

      const toUsers = getUsers( whoWillSeeChanges! ) as string[];
      const toKickedUser = getUser( whoWasKickedId );

      toUsers.length && io.to( toUsers ).emit( "kick_user_result", whoWasKickedId, conversationId );
      toKickedUser && io.to( toKickedUser ).emit( "i_was_kicked", `Адмін ${ whoIsAdmin?.username } видалив вас із бесіди "${ conversation?.conversationName }"`, conversationId );
   } );

}