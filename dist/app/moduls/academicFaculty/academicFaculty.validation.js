"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicFacultySchemaValidation = void 0;
const zod_1 = require("zod");
const academicFacultySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ invalid_type_error: 'Academic faculty must be string', })
    })
});
const updateAcademicFacultySchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string({ invalid_type_error: 'Academic faculty must be string', })
    })
});
exports.academicFacultySchemaValidation = {
    academicFacultySchema,
    updateAcademicFacultySchema
};
