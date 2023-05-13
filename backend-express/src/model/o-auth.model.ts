import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface OAuthAttr {
   id: number;
   ownerId: number;
   accessToken: string;
   refreshToken: string;
}

interface OAuthCreationAttr {
   ownerId: number;
   accessToken: string;
   refreshToken: string;
}

@Table({ tableName: "oAuth", timestamps: false })
export class OAuth extends Model<OAuthAttr, OAuthCreationAttr> {

   @BelongsTo(() => User, "ownerId")
   readonly owner: User;

   @Column({ type: DataType.STRING, allowNull: false })
   readonly accessToken: string;

   @Column({ type: DataType.INTEGER, allowNull: false })
   readonly ownerId: number;

   @Column({ type: DataType.STRING, allowNull: false })
   readonly refreshToken: string;

}