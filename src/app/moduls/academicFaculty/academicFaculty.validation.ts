import { z } from 'zod';

const academicFacultySchema = z.object({
    body: z.object({
        name: z.string({invalid_type_error: 'Academic faculty must be string',})
    })
}) 
const updateAcademicFacultySchema = z.object({
    body: z.object({
        name: z.string({invalid_type_error: 'Academic faculty must be string',})
    })
}) 

export const academicFacultySchemaValidation = {
    academicFacultySchema,
    updateAcademicFacultySchema
}