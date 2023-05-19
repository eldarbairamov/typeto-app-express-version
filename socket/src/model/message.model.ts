import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Conversation } from "./conversation.model";

interface MessageAttr {
   id: number;
   senderId: number;
   conversationId: number;
   content: string;
   lastModified: number;
}

@Table({ tableName: "message", timestamps: false })
export class Message extends Model<MessageAttr> {

   @Column({ type: DataType.TEXT, allowNull: false })
   content: string;

   @Column({ type: DataType.INTEGER, allowNull: false })
   senderId: number;

   @Column({ type: DataType.INTEGER, allowNull: false })
   conversationId: number;

   @Column({ type: DataType.BIGINT, allowNull: true })
   lastModified: number;

   @BelongsTo(() => User, "senderId")
   sender: User;

   @BelongsTo(() => Conversation, { foreignKey: 'conversationId', onDelete: "CASCADE" })
   conversation: Conversation;

}
