import { Server } from "socket.io";
import { ISocketUser } from "./src/interface/user.interface";
import { IMessage } from "./src/interface/message.interface";
import { config } from "./src/config/config";
import { ConversationRepository } from "./src/repository/conversation.repository";

const io = new Server(3200, { cors: { origin: config.CLIENT_URL } });

let users: ISocketUser[] = [];

const addUser = ( userId: number, socketId: string ) => {
   if (!users.some(user => user.userId === userId)) {
      users.push({ userId, socketId });
   }
};

const removeUser = ( socketId: string ) => {
   users = users.filter(( user ) => user.socketId !== socketId);
};

const getUser = ( userId: number ) => {
   return users.find(( user ) => user.userId === userId)?.socketId;
};

const getUsers = ( userIds: number[] ) => {
   return users
       .map(( user ) => {
          if (userIds.includes(user.userId)) return user.socketId;
          return null;
       })
       .filter(item => item !== null);
};

export const startSocket = () => {
   io.on("connection", ( socket ) => {
      console.log("user " + socket.id + " is connected");

      socket.on("add_user", ( userId: number ) => {
         addUser(userId, socket.id);
         io.emit("who_is_online", users.map(u => u.userId));
      });

      socket.on("conversation", ( conversationId: number ) => {
         socket.join(String(conversationId));
         console.log("user " + socket.id + " joined to conversation: " + conversationId);
      });

      socket.on("create_conversation", async ( conversationId: number, whoCreatedId: number, conversationWith: number[] ) => {
         const conversation = await ConversationRepository.findByPk(conversationId, whoCreatedId);

         if (!conversation.isGroupConversation) {
            const to = String(getUser(conversationWith[0]));
            io.to(to).emit("get_conversation", conversation);
         }
         else {
            const to = getUsers(conversation.users.map(u => u.id)) as string[];
            socket.to(to).emit("get_conversation", conversation);
         }
      });

      socket.on("delete_conversation", async ( conversationId: number, conversationWith: number, whoDeleted: { id: number, username: string } ) => {
         const conversations = await ConversationRepository.findAll(conversationWith);
         const to = String(getUser(conversationWith));
         io.to(to).emit("get_delete_result", conversations, whoDeleted.username);
      });

      socket.on("leave_group_conversation", async ( conversationId: number, conversationWith: number[], whoLeft: string ) => {
         const conversation = await ConversationRepository.findByPk(conversationId);
         const to = String(getUsers(conversationWith));
         io.to(to).emit("get_leave_result", conversation, whoLeft);
      });

      // socket.on('delete_group_conversation', ( deleteResult: IConversation[], conversation: IConversation, adminUsername: string ) => {
      //    const to = getUsers(conversation.users.map(u => u.id)) as string[];
      //    io.to(to).emit('get_delete_group_result', deleteResult, adminUsername);
      // });

      socket.on("send_message", ( message: IMessage ) => {
         io.in(String(message.conversationId)).emit("get_message", message);
      });

      socket.on("disconnect", () => {
         removeUser(socket.id);
         console.log("user " + socket.id + " is disconnected");
         io.emit("refresh_online_users", users.map(u => u.userId));
      });

   });
};