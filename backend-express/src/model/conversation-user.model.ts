import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";
import { Conversation } from "./conversation.model";

interface ConversationAttr {
   readonly conversationId: number;
   readonly userId: number;
}

@Table({ tableName: "conversationUser", timestamps: false })
export class ConversationUser extends Model<ConversationAttr> {

   @ForeignKey(() => Conversation)
   @Column
   readonly conversationId: number;

   @ForeignKey(() => User)
   @Column
   readonly userId: number;

}