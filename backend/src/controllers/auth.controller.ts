
import type { LogInType } from "../types/userType.js";
import type { NextFunction, Request, Response } from "express";

import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../utils/errorHandler.js";

import { authServices } from "../services/auth.services.js";
import type { TypeUser } from "../types/userType.js";
import { tokenCookie } from "../utils/setTokenCookie.js";

export const authController = {

  login: catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as LogInType


    if (!email || !password) {
      return next(new AppError("Please enter all the fields", 400))

    }

    const { user, token } = await authServices.loginService(email, password)

    tokenCookie.setCookie(res, token)

    res.status(200).json({
      message: "User logged in successfully",
      success: true,
      user
    })
  })
  ,
  signUp: catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const { name, email, password } = req.body as TypeUser

    if (!name || !email || !password) {
      return next(new AppError("All fields are required", 400))
    }

    const { user, token } = await authServices.signUpService(name, email, password)

    tokenCookie.setCookie(res, token);

    res.status(201).json({ message: "User created successfully", success: true, user })

  })
}


