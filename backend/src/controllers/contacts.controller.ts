import { catchAsync } from "../utils/catchAsync.js";
import { contactServices } from "../services/contacts.services.js";
import type { Response, Request, NextFunction } from "express";
import { AppError } from "../utils/errorHandler.js";

export const contactController = {

    addContact: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId, contactId, savedName } = req.body
        if (!ownerId || !contactId) {
            throw next(new AppError("All fields are required", 400))
        }
      
        const contact = await contactServices.addContactService(ownerId, contactId , savedName)
        res.status(201).json({ success: true, data: contact })
    }),

    getContacts: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId } = req.body
        if (!ownerId) {
            throw next(new AppError("something went wrong", 500))
        }
        const contacts = await contactServices.getContactsService(ownerId)
        res.status(200).json({ success: true, data: contacts })

    }),

    deleteContact: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId, contactId } = req.body
        if (!ownerId || !contactId) {
            throw next(new AppError("something went wrong try again later", 500))
        }
        const contact = await contactServices.deleteContactService(ownerId, contactId)
        res.status(200).json({ success: true, data: contact })
    }),

    updateContact: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const { ownerId, contactId, savedName } = req.body
        if (!ownerId || !contactId ) {
            throw next(new AppError("something went wrong try again later ", 500))
        }
        if(!savedName){
            throw next(new AppError("name can't be empty ",400))
        }
        const contact = await contactServices.updateContactService(ownerId, contactId, savedName)
        res.status(200).json({ success: true, data: contact })
    }),
}