"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicDepartmentSchemaValidations = void 0;
const zod_1 = require("zod");
const academicDepartmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic department must be string',
            required_error: 'Name is required',
        }),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is required',
        })
    }),
});
const updateAcademicDepartmentSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({
            invalid_type_error: 'Academic department must be string',
            required_error: 'Name is required',
        }).optional(),
        academicFaculty: zod_1.z.string({
            invalid_type_error: 'Academic Faculty must be string',
            required_error: 'Faculty is required',
        }).optional()
    }),
});
exports.academicDepartmentSchemaValidations = {
    academicDepartmentSchema,
    updateAcademicDepartmentSchema
};
