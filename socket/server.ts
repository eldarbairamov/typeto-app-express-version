import { Server } from 'socket.io';
import { IMessage } from "./src/interface/message.interface";
import { userService } from "./src/helper/add-user.helper";

const io = new Server(3200, { cors: { origin: 'http://localhost:5173' } });

const { addUser, users, getUser, removeUser } = userService();

io.on('connection', ( socket ) => {
   console.log('user ' + socket.id + ' is connected');

   socket.on('add_user', ( userId: number ) => {
      addUser(userId, socket.id);
      io.emit('who_is_online', { userIds: users.map(u => u.userId) });
   });

   socket.on('conversation', ( conversationId: number ) => {
      socket.join(String(conversationId));
      console.log('user ' + socket.id + ' joined to conversation: ' + conversationId);
   });

   socket.on("send_message", ( message: IMessage ) => {
      console.log(String(message.conversationId));
      io.in(String(message.conversationId)).emit('get_message', message);
   });

   socket.on('disconnect', () => {
      console.log('user ' + socket.id + ' is disconnected');
   });


});
