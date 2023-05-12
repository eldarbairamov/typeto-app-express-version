import { BelongsTo, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "./user.model";

interface ActionTokenAttr {
    readonly id: number;
    readonly token: string;
    readonly tokenType: string;
    readonly ownerId: string;
    readonly owner: User;
}

interface ActionTokenCreationAttr {
    readonly token: string;
    readonly tokenType: string;
    readonly ownerId: number;
}

@Table({ tableName: "actionToken", timestamps: false })
export class ActionToken extends Model<ActionTokenAttr, ActionTokenCreationAttr> {

    @Column({ type: DataType.STRING, allowNull: false })
    readonly token: string;

    @Column({ type: DataType.STRING, allowNull: false })
    readonly tokenType: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    readonly ownerId: number;

    @BelongsTo(() => User, "ownerId")
    readonly owner: User;

}