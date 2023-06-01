import { BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { Message } from "./message.model";
import { User } from "./user.model";
import { ConversationUser } from "./conversation-user.model";

export interface ConversationAttr {
   id: number;
   conversationName: string;
   isGroupConversation: boolean;
   adminId: number;
   lastModified: number;
   lastMessage: Message;
   users: User[];
   messages: Message[];
}

@Table({ tableName: "conversation", timestamps: false })
export class Conversation extends Model<ConversationAttr> {

   @Column({ type: DataType.STRING, allowNull: true })
   conversationName: string;

   @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
   isGroupConversation: boolean;

   @Column({ type: DataType.INTEGER, allowNull: true, defaultValue: null })
   adminId: number;

   @Column({ type: DataType.BIGINT, allowNull: true })
   lastModified: number;

   @HasOne(() => Message, "conversationId")
   lastMessage: Message;

   @BelongsToMany(() => User, () => ConversationUser, "conversationId")
   users: User[];

   @BelongsTo(() => User, "adminId")
   admin: User;

   @HasMany(() => Message, { foreignKey: 'conversationId' })
   messages: Message[];

}
