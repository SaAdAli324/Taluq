import express from 'express'
import { contactController } from '../controllers/contacts.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const route = express.Router()

route.get("/get" , contactController.getContacts)
route.post('/add' , contactController.addContact)
route.delete("/delete" , contactController.deleteContact)
route.put('/update', contactController.updateContact)

export default route