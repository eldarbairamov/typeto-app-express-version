import { Server } from "socket.io";
import { config } from "./src/config/config";
import { createConversationService, leaveGroupConversationService, sendMessageService } from "./src/service";
import { IMessage, ISocketUser } from "./src/interface";
import { Conversation, User } from "./src/model";

const io = new Server(3200, { cors: { origin: config.CLIENT_URL } });

let users: ISocketUser[] = [];

const addUser = ( userId: number, socketId: string ) => {
   if (!users.some(user => user.userId === userId)) users.push({ userId, socketId });
};

const removeUser = ( socketId: string ) => users = users.filter(( user ) => user.socketId !== socketId);

const getUser = ( userId: number ) => users.find(( user ) => user.userId === userId)?.socketId;

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
         const conversation = await createConversationService(conversationId, whoCreatedId);

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
         const to = String(getUser(conversationWith));
         io.to(to).emit("get_delete_result", conversationId, whoDeleted.username);
      });

      socket.on("leave_group_conversation", async ( conversationId: number, conversationWith: number[], whoLeft: string ) => {
         const conversation = await leaveGroupConversationService(conversationId);
         const to = getUsers(conversationWith) as string[];
         io.to(to).emit("get_leave_result", conversation, whoLeft);
      });

      socket.on("delete_group_conversation", ( conversationWith: number[], conversationId: number, adminName: string ) => {
         const to = getUsers(conversationWith) as string[];
         if (to.length) io.to(to).emit("get_delete_group_result", conversationId, adminName);
      });

      socket.on("send_message", async ( message: IMessage ) => {
         const [ conversationForSender, conversationForReceiver, users ] = await Promise.all([
            sendMessageService(message.conversationId, message.senderId, "sender"),
            sendMessageService(message.conversationId, message.senderId, "receiver"),
            Conversation
                .findByPk(message.conversationId, {
                   include: {
                      model: User,
                      as: "users",
                      attributes: [ "id", "username", "email", "image" ],
                   }
                }).then(res => res?.users.map(u => u.id))
         ]);

         const to = getUsers(users!) as string[];

         io.to(to).emit("get_message", message, conversationForSender, conversationForReceiver);
      });

      socket.on("disconnect", () => {
         removeUser(socket.id);
         io.emit("refresh_online_users", users.map(u => u.userId));
         console.log("user " + socket.id + " is disconnected");
      });

   });
};