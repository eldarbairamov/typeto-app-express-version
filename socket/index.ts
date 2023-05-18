import { Server } from 'socket.io';
import { IMessage } from "./src/interface/message.interface";
import { ISocketUser } from "./src/interface/user.interface";
import { IConversation } from "./src/interface/interface.interface";

const io = new Server(3200, { cors: { origin: 'http://localhost:5173' } });

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

io.on('connection', ( socket ) => {
   console.log('user ' + socket.id + ' is connected');

   socket.on('add_user', ( userId: number ) => {
      addUser(userId, socket.id);
      io.emit('who_is_online', users.map(u => u.userId));
   });

   socket.on('conversation', ( conversation: IConversation ) => {
      socket.join(String(conversation.id));
      console.log('user ' + socket.id + ' joined to conversation: ' + conversation.id);
   });

   socket.on('create_conversation', ( conversation: IConversation ) => {
      io.to(String(getUser(conversation.conversationWith[0].id))).emit('get_conversation', conversation);
   });

   socket.on("send_message", ( message: IMessage ) => {
      io.in(String(message.conversationId)).emit('get_message', message);
   });

   socket.on('disconnect', () => {
      removeUser(socket.id);
      console.log('user ' + socket.id + ' is disconnected');
      io.emit('refresh_online_users', users.map(u => u.userId));
   });


});
