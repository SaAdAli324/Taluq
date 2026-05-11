import { messagesController } from "../controllers/message.controller.js";
import { protect } from "../middleware/auth.middleware.js";

import express from "express";

const router = express.Router()
router.post("/send/:_id", protect, messagesController.sendMessage)
router.get("/:conversationId", protect, messagesController.getMessages)
router.patch("/delete/:messageId/:userId", protect, messagesController.deleteMessage)
router.patch("/update/:messageId/:userId", protect, messagesController.updateMessage)

export default router