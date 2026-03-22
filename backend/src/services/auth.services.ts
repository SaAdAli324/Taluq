import { User } from "../models/user.model.js";
import { AppError } from "../utils/errorHandler.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";

export const authServices = {

    async loginService(email: string, password: string) {
        const user = await User.findOne({ email })

        if (!user || !(await bcrypt.compare(password, user.password!))) {
            throw new AppError("invalid email or password", 401)
        }

        const { password: _, ...userObj } = user.toObject()

        const token = generateToken(user._id.toString())

        return { token, user: userObj }
    },

    async signUpService(name: string, email: string, password: string, profilePic?: string) {
        const existingUser = await User.findOne({ email })

        if (existingUser) {
            throw new AppError("User already exists", 400)
        }

        const hashedPass = await bcrypt.hash(password, 10)

        const newUser = new User({
            name,
            email,
            password: hashedPass,
            profilePic
        })

        await newUser.save()

        const { password: _, ...userObj } = newUser.toObject()

        const token = generateToken(newUser._id.toString())

        return { token, user: userObj }
    }

}
