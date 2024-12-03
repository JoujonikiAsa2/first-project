import { z } from 'zod';

const academicDepartmentSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty must be string',
      required_error: 'Faculty is required',
    })
  }),
});

const updateAcademicDepartmentSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic department must be string',
      required_error: 'Name is required',
    }).optional(),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Faculty must be string',
      required_error: 'Faculty is required',
    }).optional()
  }),
});

export const academicDepartmentSchemaValidations = {
  academicDepartmentSchema,
  updateAcademicDepartmentSchema
} 
