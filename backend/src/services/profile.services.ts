import { User } from "../models/user.model.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";
import type { NextFunction, Request, Response } from "express";

const profileServices = async (_id:string)=>{
    const user = await User.findById({_id}).select("-password")
    if (!user) {
        throw new AppError("user not found",404)
    }
    return user
}


export default profileServices