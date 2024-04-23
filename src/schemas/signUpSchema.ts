import { z } from 'zod'

export const usernameValidation = z
            .string()
            .min(3, { message: 'Username must be at least 3 characters long' })
            .max(20, { message: 'Username must be at most 20 characters long' })
            .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username must contain only letters and numbers' })

const emailValidation = z
            .string()
            .email({ message: 'Invalid email address' })
    
const passwordValidation = z
            .string()
            .min(8, { message: 'Password must be at least 8 characters long' })


export const signUpSchema = z.object({
    username: usernameValidation,
    email: emailValidation,
    password: passwordValidation
})