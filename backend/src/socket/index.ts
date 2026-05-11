import type { Server } from "socket.io";

import { authSocket } from "./middleWares/authSocket.js";
import logger from "../utils/logger.js";
import { User } from "../models/user.model.js";
const onlineUsers = new Map<string, string>()
export const initializeSocket = (io: Server) => {

  io.use(authSocket)
  io.on("connection", async (socket) => {
    logger.info("user connected", socket.data.user.name)

    const user = socket.data.user
    const userId = user._id.toString()
    socket.join(userId)

    onlineUsers.set(userId, socket.id)

    io.emit("user_online", userId)

    socket.on("request_online_users", () => {
      socket.emit("get_online_users", Array.from(onlineUsers.keys()))

    })

    logger.info("online users", onlineUsers)
    socket.on("disconnect", async () => {

      logger.info("user disconnected", user.name)
      onlineUsers.delete(userId)
      io.emit("user_offline", userId)



    })
  })
}