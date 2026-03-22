import type { Server } from "socket.io";

import { authSocket } from "./middleWares/authSocket.js";
import { messageHanlder } from "./handlers/messageHandler.js";
import logger from "../utils/logger.js";

export const initializeSocket = (io:Server)=>{
    io.use(authSocket)
    io.on("connection",(socket)=>{
        logger.info("user connected",socket.data.user.name)
        messageHanlder(io , socket)
    })
}