import { z } from "zod";

const userValidationSchema = z.object({
    id: z.string(),
    password: z.string().max(20, { message: 'Password cannot exceed 20 characters' }),
});

export default userValidationSchema