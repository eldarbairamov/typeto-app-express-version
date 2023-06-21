import "dotenv/config";
import cors from "cors";
import express, { Application } from "express";
import { config } from "./config";
import { sequelize } from "./db";
import { appRouter } from "./router";
import { errorMiddleware } from "./middleware";
import fileUpload from "express-fileupload";
import path from "node:path";
import process from "process";

const app: Application = express();

app.use( express.json() )
    .use( express.urlencoded( { extended: true } ) )
    .use( cors( { origin: "*" } ) )
    .use( fileUpload() )
    .use( appRouter )
    .use( express.static( path.join( process.cwd(), "client" ) ) )
    .use( errorMiddleware );

const start = async () => {
   await sequelize.authenticate();
   await sequelize.sync();
   app.listen( config.PORT );
};

start()
    .then( () => console.log( `Database is connected. Server is started on port ${ config.PORT }` ) )
    .catch( ( e ) => console.log( e ) );