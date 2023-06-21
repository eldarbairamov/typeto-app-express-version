import "dotenv/config";
import { sequelize } from "./db";
import { startSocket } from "./socket";
import { BLUE_COLOR } from "./constant";
import { config } from "./config";

const startDb = async () => {
   await sequelize.authenticate();
   await sequelize.sync();
};

startDb()
    .then( () => startSocket() )
    .then( () => console.log( BLUE_COLOR, `Database is connected. Socket.io is started on port ${ config.SOCKET_PORT }` ) );