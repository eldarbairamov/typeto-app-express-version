import { Sequelize } from "sequelize-typescript";
import process from "process";
import { ActionToken, Contacts, Conversation, ConversationUser, Message, OAuth, User } from "../model";

export const sequelize = new Sequelize(
    String(process.env.POSTGRES_DB),
    String(process.env.POSTGRES_USER),
    String(process.env.POSTGRES_PASSWORD),
    {
       dialect: "postgres",
       host: process.env.POSTGRES_HOST,
       port: Number(process.env.POSTGRES_PORT),
       logging: false,
       models: [ Message, User, Conversation, ConversationUser, OAuth, ActionToken, Contacts ],
    });