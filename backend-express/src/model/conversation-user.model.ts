import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Conversation } from "./conversation.model";

export interface ConversationUserAttr {
   readonly conversationId: number;
   readonly userId: number;
   readonly isNewMessagesExist: boolean;
}

interface ConversationUserCreationAttr {
   readonly conversationId: number;
   readonly userId: number;
   readonly isNewMessagesExist?: boolean;
}

@Table({ tableName: "conversationUser", timestamps: false })
export class ConversationUser extends Model<ConversationUserAttr, ConversationUserCreationAttr> {

   @ForeignKey(() => Conversation)
   @Column
   readonly conversationId: number;

   @ForeignKey(() => User)
   @Column
   readonly userId: number;

   @Column({ type: DataType.BOOLEAN, allowNull: true, defaultValue: false })
   readonly isNewMessagesExist: boolean;

}