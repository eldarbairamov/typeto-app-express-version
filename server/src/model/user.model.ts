import { BeforeCreate, BeforeUpdate, BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { Contacts } from "./contacts.model";
import { Conversation } from "./conversation.model";
import { ConversationUser } from "./conversation-user.model";
import { passwordService } from "../service";

export interface UserAttr {
   id: number;
   username: string;
   email: string;
   password: string;
   image?: string | null;
   conversations: Conversation[];
}

interface UserCreationAttr {
   username: string;
   email: string;
   password: string;
   image?: string | null;
}

@Table({ tableName: "user", timestamps: false })
export class User extends Model<UserAttr, UserCreationAttr> {

   @Column({ type: DataType.STRING, allowNull: false })
   username: string;

   @Column({ type: DataType.STRING, allowNull: false })
   email: string;

   @Column({ type: DataType.STRING, allowNull: false })
   password: string;

   @Column({ type: DataType.STRING, allowNull: true })
   image: string | null;

   @BelongsToMany(() => Conversation, () => ConversationUser, "userId")
   conversations: Conversation[];

   @BelongsToMany(() => User, () => Contacts, "userId")
   contacts: User[];

   @BeforeCreate
   @BeforeUpdate
   static async hashPass( instance: User ) {
      instance.password = await passwordService.passHasher(instance.password);
   }

}

