import { Column, DataType, ForeignKey, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface ContactsAttr {
   readonly userId: number,
   readonly contactId: number
}

@Table( { tableName: "contacts", timestamps: false } )
export class Contacts extends Model<ContactsAttr> {

   @ForeignKey( () => User )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly contactId: number;

   @ForeignKey( () => User )
   @Column( { type: DataType.INTEGER, unique: false } )
   readonly userId: number;

}