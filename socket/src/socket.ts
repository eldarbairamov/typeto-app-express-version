import { Server } from "socket.io";
import { config } from "./config";
import { createConversationService, deleteMessageService, kickUserService, leaveGroupConversationService, sendMessageService } from "./service";
import { IMessage, ISocketUser } from "./interface";
import { CYAN_COLOR, GREEN_COLOR, MAGENTA, RED_COLOR } from "./constant";
import { ConversationUser, User } from "./model";
import { Op } from "sequelize";

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
      console.log(MAGENTA, "socket: connection");
      console.log(GREEN_COLOR, "user " + socket.id + " is connected");

      socket.on("add_user", ( userId: number ) => {
         console.log(MAGENTA, "socket: add_user");
         addUser(userId, socket.id);
         io.emit("who_is_online", users.map(u => u.userId));
      });

      socket.on("join_to_conversation", ( conversationId: number ) => {
         console.log(MAGENTA, "socket: join to conversation");
         socket.join(String(conversationId));
         console.log(CYAN_COLOR, "user " + socket.id + " joined to conversation: " + conversationId);
      });

      socket.on("create_conversation", async ( conversationId: number, whoCreatedId: number, conversationWith: number[] ) => {
         console.log(MAGENTA, "socket: create_conversation");

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
         console.log(MAGENTA, "socket: delete_conversation");

         const to = String(getUser(conversationWith));
         io.to(to).emit("get_delete_result", conversationId, whoDeleted.username);
      });

      socket.on("leave_group_conversation", async ( conversationId: number, conversationWith: number[], whoLeft: string ) => {
         console.log(MAGENTA, "socket: leave_group_conversation");

         const conversation = await leaveGroupConversationService(conversationId);
         const to = getUsers(conversationWith) as string[];
         io.to(to).emit("get_leave_result", conversation, whoLeft);
      });

      socket.on("delete_group_conversation", ( conversationWith: number[], conversationId: number, adminName: string ) => {
         console.log(MAGENTA, "socket: delete_group_conversation");

         const to = getUsers(conversationWith) as string[];
         if (to.length) io.to(to).emit("get_delete_group_result", conversationId, adminName);
      });

      socket.on("delete_message", async ( messageId: number, conversationId: number, currentUserId: number ) => {
         console.log(MAGENTA, "socket: delete_message");

         const { conversationWith, updatedLastMessage } = await deleteMessageService(conversationId, currentUserId);
         const to = getUsers(conversationWith) as string[];

         if (to.length) io.to(to).emit("delete_message_result", messageId, conversationId, updatedLastMessage);
      });

      socket.on("send_message", async ( message: IMessage ) => {
         console.log(MAGENTA, "socket: send_message");
         const { conversationForSender, conversationForReceiver, users } = await sendMessageService(message);
         const to = getUsers(users!) as string[];
         io.to(to).emit("get_message", message, conversationForSender, conversationForReceiver);
      });

      socket.on("kick_user_from_group_conversation", async ( conversationId: number, whoWasKickedId: number, adminId: number ) => {
         console.log(MAGENTA, "socket: kick_user_from_group_conversation");
         const { whoIsAdmin, whoWillSeeChanges, conversation } = await kickUserService(conversationId, whoWasKickedId, adminId);

         const toUsers = getUsers(whoWillSeeChanges!) as string[];
         const toKickedUser = getUser(whoWasKickedId);

         toUsers.length && io.to(toUsers).emit("kick_user_result", whoWasKickedId, conversationId);
         toKickedUser && io.to(toKickedUser).emit("i_was_kicked", `Адмін ${ whoIsAdmin?.username } видалив вас із бесіди "${ conversation?.conversationName }"`, conversationId);
      });

      socket.on("typing", async ( conversationId: number, whoTypingId: number ) => {
         console.log(MAGENTA, "socket: typing");

         const conversationWith = await ConversationUser.findAll({
            where: {
               conversationId,
               userId: {
                  [Op.ne]: whoTypingId
               }
            },
         })
             .then(conversationUser => conversationUser.map(c => c.userId));

         const whoTyping = await User.findByPk(whoTypingId);

         const to = getUsers(conversationWith) as string[];
         to.length && io.to(to).emit("someone_is_typing", conversationId, whoTyping?.username);
      });

      socket.on("stop_typing", async ( conversationId: number, whoIsTypingId: number ) => {
         console.log(MAGENTA, "socket: stop_typing");

         const conversationWith = await ConversationUser.findAll({
            where: {
               conversationId,
               userId: {
                  [Op.ne]: whoIsTypingId
               }
            },
         })
             .then(conversationUser => conversationUser.map(c => c.userId));

         const whoIsTyping = await User.findByPk(whoIsTypingId);

         const to = getUsers(conversationWith) as string[];
         to.length && io.to(to).emit("someone_is_stop_typing", conversationId, whoIsTyping?.username);
      });

      socket.on("disconnect", () => {
         console.log(MAGENTA, "socket: disconnect");
         console.log(RED_COLOR, "user " + socket.id + " is disconnected");

         removeUser(socket.id);
         io.emit("refresh_online_users", users.map(u => u.userId));
      });

   });
};