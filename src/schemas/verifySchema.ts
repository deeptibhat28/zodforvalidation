import {z} from "zod"



export const verifySchema = z.object({
    code: z.string().length(6, "Verification code must be six digits").regex(/^\d+$/, "Verification code must contain only digits"),
})