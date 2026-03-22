import { Server, Socket } from "socket.io";

import { Conversation } from "../../models/converstion.model.js";
import { Messages } from "../../models/messages.model.js";
import logger from "../../utils/logger.js";

export const messageHanlder = (io: Server, socket: Socket) => {
    const user = socket.data.user

    socket.join(user._id.toString())

    socket.on("send_message", async (data: { to: string, message: string }) => {
        try {
            let conversation = await Conversation.findOne({
                participants: { $all: [user._id, data.to] }
            })
            if (!conversation) {
                conversation = await Conversation.create({
                    participants: [user._id, data.to]
                })

            }
            const newMessage = await Messages.create({
                conversationId: conversation._id,
                sender: user._id,
                text: data.message

            })
            conversation.lastMessage = newMessage._id
            await conversation.save()

            io.to(data.to).emit("receive_message", {
                _id: newMessage._id,
                sender: user._id,
                text: newMessage.text,
                createdAt: newMessage.createdAt
            })
        } catch (error) {
            socket.emit("error", { message: "failed to send message" })
        }
    })
    socket.on("disconnect", () => {
        logger.info(`${user.name} disconnected`)
    })
}