import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getProfile } from "../controllers/profile.controller.js";

const route = express.Router()

route.get("/profile" , protect , getProfile )

export default route