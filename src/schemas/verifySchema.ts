import { z } from 'zod'

export const verifyCodeSchema = z.object({
            code: z
                .string()
                .length(6, { message: 'Verify code must be 6 characters long' })
                .regex(/^[0-9]+$/, { message: 'Verify code must contain only numbers' })
})