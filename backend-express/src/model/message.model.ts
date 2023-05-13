import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { Optional } from "sequelize";
import { User } from "./user.model";
import { Conversation } from "./conversation.model";

interface MessageAttr {
   id: number;
   senderId: number;
   chatRoomId: number;
   message: string;
   createdAt: Date;
}

interface MessageCreationAttr extends Optional<MessageAttr, "id"> {
}

@Table({ tableName: "message", timestamps: false, createdAt: true })
export class Message extends Model<MessageAttr, MessageCreationAttr> {

   @Column({ type: DataType.STRING, allowNull: false })
   message: string;

   @Column({ type: DataType.INTEGER, allowNull: false })
   senderId: number;

   @Column({ type: DataType.INTEGER, allowNull: false })
   conversationId: number;

   @BelongsTo(() => User, "senderId")
   sender: User;

   @BelongsTo(() => Conversation, "conversationId")
   conversation: Conversation;
}
