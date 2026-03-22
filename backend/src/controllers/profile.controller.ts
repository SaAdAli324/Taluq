import profileServices from "../services/profile.services.js";
import type { Request , Response , NextFunction } from "express";

import { catchAsync } from "../utils/catchAsync.js";

export const getProfile =catchAsync(async (req:Request , res:Response , next:NextFunction) => {

    const _id= (req as any).user._id
    const user = await profileServices(_id)
    res.status(200).json({
        success:true,
        user,
        message:"user fetched successfully"
    })
})