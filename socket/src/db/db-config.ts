import { Sequelize } from "sequelize-typescript";
import process from "process";
import { Contacts, Conversation, ConversationUser, Message, User } from "../model";

export const sequelize = new Sequelize(
    String(process.env.DB_NAME),
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD),
    {
       dialect: "postgres",
       host: process.env.DB_HOST,
       port: Number(process.env.DB_PORT),
       logging: false,
       models: [ Conversation, User, Message, ConversationUser, Contacts ]
    }
);