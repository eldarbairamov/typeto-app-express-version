import { Column, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface ContactsAttr {
   readonly userId: number,
   readonly contactId: number
}

@Table( { tableName: "contacts", timestamps: false } )
export class Contacts extends Model<ContactsAttr, ContactsAttr> {

   @ForeignKey( () => User )
   @Column
   readonly contactId: number;

   @ForeignKey( () => User )
   @Column
   readonly userId: number;

}