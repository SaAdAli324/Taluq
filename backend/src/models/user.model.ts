import mongoose, { Document } from "mongoose";
import { type TypeUser } from "../types/userType.js";


export interface TypeSignUp extends TypeUser, Document { }
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    googleId: {
        type: String,
    },
    profilePic: {
       type:String,
       default:""

    },
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)


