"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseValidations = void 0;
const zod_1 = require("zod");
const PreRequisiteCourseValidationSchema = zod_1.z.object({
    course: zod_1.z.array(zod_1.z.string()),
    isDeleted: zod_1.z.boolean().optional()
});
const createCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        prefix: zod_1.z.string(),
        title: zod_1.z.string(),
        code: zod_1.z.string(),
        credit: zod_1.z.number(),
        preRequisiteCourses: zod_1.z.array(PreRequisiteCourseValidationSchema).optional(),
        isDeleted: zod_1.z.boolean().default(false)
    })
});
const updateCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        prefix: zod_1.z.string().optional(),
        title: zod_1.z.string().optional(),
        code: zod_1.z.string().optional(),
        credit: zod_1.z.number().optional(),
        preRequisiteCourses: zod_1.z.array(PreRequisiteCourseValidationSchema).optional(),
        isDeleted: zod_1.z.boolean().default(false)
    })
});
const facultiesWithCourseValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        faculties: zod_1.z.array(zod_1.z.string())
    })
});
exports.courseValidations = {
    createCourseValidationSchema,
    updateCourseValidationSchema,
    facultiesWithCourseValidationSchema
};
