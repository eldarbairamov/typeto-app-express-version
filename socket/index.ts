import "dotenv/config";
import { sequelize } from "./src/db/db-config";
import { startSocket } from "./socket";
import { config } from "./src/config/config";

const startDb = async () => {
   await sequelize.authenticate();
   await sequelize.sync();
};

startDb()
    .then(() => startSocket())
    .then(() => console.log(`Database is connected. Socket.io is started on port ${ config.SOCKET_PORT }`));