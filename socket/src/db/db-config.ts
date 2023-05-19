import { Sequelize } from "sequelize-typescript";
import process from "process";
import { Conversation } from "../model/conversation.model";
import { User } from "../model/user.model";
import { Message } from "../model/message.model";
import { ConversationUser } from "../model/conversation-user.model";
import { Contacts } from "../model/contacts.model";

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