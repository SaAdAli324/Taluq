import mongoose from "mongoose";
import { Messages } from "../models/messages.model.js";
import { AppError } from "../utils/errorHandler.js";
import logger from "../utils/logger.js";
import { Conversation } from "../models/conversation.model.js";

export const messageServices = {

    async sendMessageService(user: string, receiver: string, text: string) {

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
            text: text,
            issend:true
        });

        logger.info(`Message received from ${user} to ${receiver}: ${text}`);
        conversation.lastMessage = newMessage._id
        await conversation.save()
        return newMessage
    },

    async getMessageService(conversationId: string) {
        const messages = await Messages.find({ conversationId: conversationId })
        if (messages.length === 0) {
            throw new AppError("no messaages to show", 404)
        }
        const sortMessages = messages.sort((a,b)=> (a.createdAt as any) - (b.createdAt as any))
        return sortMessages
    },
    async deleteMessageService(messageId: string,) {
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            throw new AppError("Invalid message ID format", 400);
        }
        const newMessage = await Messages.findOneAndUpdate({ _id: messageId }, { text: "this message has been deleted", deleted: true }, { new: true })

        if (!newMessage) {
            throw new AppError("message not found", 404)
        }


        console.log("this is the new messags", newMessage);

        return newMessage
    },
    async patchMessageService(messageId: string, text: string) {
        if (!mongoose.Types.ObjectId.isValid(messageId)) {
            throw new AppError("Invalid message ID format", 400);
        }
        const message = await Messages.findOneAndUpdate({ _id: messageId }, { text: text, isEdited: true }, { new: true })
        if (!message) {
            throw new AppError("message not found", 404)
        }
        return message
    }
}