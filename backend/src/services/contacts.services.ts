import { Contacts } from "../models/contacts.model.js";
import { AppError } from "../utils/errorHandler.js";

export const contactServices = {

    async addContactService(ownerId: string, contactId: string, savedName?: string) {
        const contact = await Contacts.findOne({ ownerId, contactId })
        if (contact) {
            throw new AppError("Contact already exists", 400)
        }
        const newContact = await Contacts.create({ ownerId, contactId, savedName: savedName || "" })
        return newContact
    },

    async getContactsService(ownerId: string) {
        const contacts = await Contacts.find({ ownerId })
        if (!contacts || contacts.length === 0) {
            throw new AppError("No contacts found", 404)
        }
        return contacts
    },

    async deleteContactService(ownerId: string, contactId: string) {
        const contacts = await Contacts.findOneAndDelete({ ownerId, contactId })
        if (!contacts) {
            throw new AppError("Contact not found", 404)
        }
        return contacts
    },

    async updateContactService(ownerId: string, contactId: string, savedName: string) {
        const contacts = await Contacts.findOne({ ownerId, contactId })
        if (!contacts) {
            throw new AppError("contact not found", 404)
        }
        contacts.savedName = savedName
        await contacts.save()
        return contacts
    },

}