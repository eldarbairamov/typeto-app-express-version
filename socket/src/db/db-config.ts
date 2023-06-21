import { Sequelize } from "sequelize-typescript";
import process from "process";
import { Contacts, Conversation, ConversationUser, Message, User } from "../model";

export const sequelize = new Sequelize(
    String( process.env.POSTGRES_DB ),
    String( process.env.POSTGRES_USER ),
    String( process.env.POSTGRES_PASSWORD ),
    {
       dialect: "postgres",
       host: process.env.POSTGRES_HOST,
       port: Number( process.env.POSTGRES_PORT ),
       logging: false,
       models: [ Conversation, User, Message, ConversationUser, Contacts ]
    }
);