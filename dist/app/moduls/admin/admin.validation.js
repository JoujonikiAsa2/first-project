"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminValidations = exports.updateAdminValidationSchema = exports.createAdminValidationSchema = void 0;
const zod_1 = require("zod");
const createUserNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z
        .string()
        .min(1)
        .max(20)
        .refine((value) => /^[A-Z]/.test(value), {
        message: 'First Name must start with a capital letter',
    }),
    middleName: zod_1.z.string(),
    lastName: zod_1.z.string(),
});
exports.createAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        password: zod_1.z.string().max(20),
        admin: zod_1.z.object({
            name: createUserNameValidationSchema,
            designation: zod_1.z.string(),
            gender: zod_1.z.enum(['male', 'female', 'other']),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email(),
            bloodGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
            contactNo: zod_1.z.string(),
            emergencyContactNo: zod_1.z.string(),
            presentAddress: zod_1.z.string(),
            permanentAddress: zod_1.z.string(),
            profileImg: zod_1.z.string(),
            managementDepartment: zod_1.z.string(),
        }),
    }),
});
const updateUserNameValidationSchema = zod_1.z.object({
    firstName: zod_1.z.string().min(1).max(20).optional(),
    middleName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
});
exports.updateAdminValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        admin: zod_1.z.object({
            designation: zod_1.z.string().optional(),
            name: updateUserNameValidationSchema,
            gender: zod_1.z.enum(['male', 'female', 'other']).optional(),
            dateOfBirth: zod_1.z.string().optional(),
            email: zod_1.z.string().email().optional(),
            bloodGroup: zod_1.z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).optional(),
            contactNo: zod_1.z.string().optional(),
            emergencyContactNo: zod_1.z.string().optional(),
            presentAddress: zod_1.z.string().optional(),
            permanentAddress: zod_1.z.string().optional(),
            profileImg: zod_1.z.string().optional(),
            managementDepartment: zod_1.z.string().optional(),
        }),
    }),
});
exports.AdminValidations = {
    createAdminValidationSchema: exports.createAdminValidationSchema,
    updateAdminValidationSchema: exports.updateAdminValidationSchema,
};
