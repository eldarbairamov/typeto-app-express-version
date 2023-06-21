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

@Table( { tableName: "conversationUser", timestamps: false } )
export class ConversationUser extends Model<ConversationUserAttr, ConversationUserCreationAttr> {

   @ForeignKey( () => Conversation )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly conversationId: number;

   @ForeignKey( () => User )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly userId: number;

   @Column( { type: DataType.BOOLEAN, allowNull: true, defaultValue: false } )
   readonly isNewMessagesExist: boolean;

}