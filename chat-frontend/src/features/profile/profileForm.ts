import{ z }from 'zod'

export const profileSchema = z.object({
    name:z.string().min(3,{message:"name must be at least 3 characters long"}),
    bio:z.string().max(100,{message:"bio must be at most 100 characters long"}),
})
export type ProfileSchema = z.infer <typeof profileSchema>