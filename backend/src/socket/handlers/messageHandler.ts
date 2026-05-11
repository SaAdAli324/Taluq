import { Server, Socket } from "socket.io";

import { Conversation } from "../../models/conversation.model.js";
import { Messages } from "../../models/messages.model.js";
import logger from "../../utils/logger.js";
import { AppError } from "../../utils/errorHandler.js";
import mongoose from "mongoose";
import type { NextFunction, Request, Response } from "express";

export const messageHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user = (req as any).user?._id?.toString()
        const receiver = req.params._id
        const text = req.body.message
        const io = (req as any).app.get("io")
        if( !text || !receiver || !user){
            return next(new AppError("all fields are required",400))
        }

        let conversation = await Conversation.findOne({
            participants: { $all: [user, receiver] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [user, receiver]
            })

        }


        const newMessage = await Messages.create({
            conversationId: conversation._id,
            sender: user,
            text: text
        });

        logger.info(`Message received from ${user} to ${receiver}: ${text}`);
        conversation.lastMessage = newMessage._id
        await conversation.save()

        io.to(receiver).emit("receive_message", {
            _id: newMessage._id,
            sender: user,
            text: newMessage.text,
            createdAt: newMessage.createdAt
        })
        res.status(201).json({
            status:"success",
            newMessage
        })
    }
    catch (error) {
      logger.error("Error in messageHandler:", error);
      res.status(500).json({
        status:"fail",
        message:"failed to send message",
        error: error instanceof Error ? error.message : "Unknown error"
      })
    }

}
    // socket.on("delete_message", async (data: { messageId: string, conversationId: string, to: string }, callback: (response: { success: boolean, data: Object }) => void) => {
    //     try {
    //         const message = await messageServices.deleteMessageService(data.messageId, data.conversationId)
    //         io.to(data.to).emit("receive_message", {
    //             _id: message?._id,
    //             sender: user?._id,
    //             text: message?.text,
    //             data: message
    //         })
    //         logger.info(`Message deleted by ${user.name}: ${message.text}`);
    //         callback({
    //             success: true,
    //             data: message
    //         })
    //     } catch (error) {
    //         socket.emit("error", { message: "failed to delete message" })
    //     }
    // })
