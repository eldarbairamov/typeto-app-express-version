import "dotenv/config";
import cors from "cors";
import express, { Application } from "express";
import { config } from "./config/config";
import { sequelize } from "./db/db-config";
import { appRouter } from "./router";
import { errorMiddleware } from "./middleware";

const app: Application = express();

app.use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(cors({ origin: "*" }))
    .use(appRouter)
    .use(errorMiddleware);

const start = async () => {
   await sequelize.authenticate();
   await sequelize.sync();
   app.listen(config.PORT);
};

start()
    .then(() => console.log(`Database is connected. Server is started on port ${ config.PORT }`))
    .catch(( e ) => console.log(e));