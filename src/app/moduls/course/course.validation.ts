import { z } from "zod";

const PreRequisiteCourseValidationSchema = z.object({
    course: z.array(z.string()),
    isDeleted: z.boolean().optional()
})

const createCourseValidationSchema = z.object({
    body: z.object({
        prefix: z.string(),
        title: z.string(),
        code: z.string(),
        credit : z.number(),
        preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
        isDeleted: z.boolean().default(false)    
    })
})
const updateCourseValidationSchema = z.object({
    body: z.object({
        prefix: z.string().optional(),
        title: z.string().optional(),
        code: z.string().optional(),
        credit: z.number().optional(),
        preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
        isDeleted: z.boolean().default(false)    
    })
})

const facultiesWithCourseValidationSchema = z.object({
    body: z.object({
        faculties: z.array(z.string())
    })
})

export const courseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    facultiesWithCourseValidationSchema
}