import { Sequelize } from "sequelize-typescript";
import process from "process";
import { ActionToken, Contacts, Conversation, ConversationUser, Message, OAuth, User } from "../model";

export const sequelize = new Sequelize(
    String(process.env.DB_NAME),
    String(process.env.DB_USER),
    String(process.env.DB_PASSWORD),
    {
       dialect: "postgres",
       host: process.env.DB_HOST,
       port: Number(process.env.DB_PORT),
       models: [ Message, User, Conversation, ConversationUser, OAuth, ActionToken, Contacts ],
       logging: false,
    });