import { BeforeCreate, BeforeUpdate, BelongsTo, BelongsToMany, Column, DataType, HasMany, HasOne, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { ConversationUser } from "./conversation-user.model";
import { Message } from "./message.model";

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

interface ConversationCreationAttr {
   conversationName?: string;
   isGroupConversation?: boolean;
   lastMessage?: Message;
   adminId?: number;
}

@Table( { tableName: "conversation", timestamps: false } )
export class Conversation extends Model<ConversationAttr, ConversationCreationAttr> {

   @Column( { type: DataType.STRING, allowNull: true } )
   conversationName: string;

   @Column( { type: DataType.BOOLEAN, allowNull: true, defaultValue: false } )
   isGroupConversation: boolean;

   @Column( { type: DataType.INTEGER, allowNull: true, defaultValue: null } )
   adminId: number;

   @Column( { type: DataType.BIGINT, allowNull: true } )
   lastModified: number;

   @BelongsToMany( () => User, () => ConversationUser, "conversationId" )
   users: User[];

   @BelongsTo( () => User, "adminId" )
   admin: User;

   @HasOne( () => Message, "conversationId" )
   lastMessage: Message;

   @HasMany( () => Message, { foreignKey: "conversationId" } )
   messages: Message[];

   @BeforeCreate
   @BeforeUpdate
   static async setMsDate( instance: Conversation ) {
      instance.lastModified = new Date().getTime();
   }

}
