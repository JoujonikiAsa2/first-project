"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
//creating a schema validation using joi
// Username Schema
const userNameSchema = joi_1.default.object({
    firstName: joi_1.default.string()
        .max(20)
        .regex(/^[A-Z][a-z]*$/, 'First Name should start with a capital letter')
        .required(),
    middleName: joi_1.default.string().max(20).allow('', null),
    lastName: joi_1.default.string()
        .regex(/^[a-zA-Z]+$/, 'Last Name must contain only letters')
        .required(),
});
// Guardian Schema
const guardianSchema = joi_1.default.object({
    fatherName: joi_1.default.string().required(),
    fatherOccupation: joi_1.default.string().required(),
    fatherContactNo: joi_1.default.string().required(),
    motherName: joi_1.default.string().required(),
    motherOccupation: joi_1.default.string().required(),
    motherContactNo: joi_1.default.string().required(),
});
// Local Guardian Schema
const localGuardianSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    occupation: joi_1.default.string().required(),
    contactNo: joi_1.default.string().required(),
    address: joi_1.default.string().required(),
});
// Main Student Schema
const studentSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    name: userNameSchema.required(),
    gender: joi_1.default.string().valid('male', 'female', 'other').required(),
    dateOfBirth: joi_1.default.string().optional(),
    email: joi_1.default.string().email().required(),
    contactNo: joi_1.default.string().required(),
    emergencyContactNo: joi_1.default.string().required(),
    bloodGroup: joi_1.default.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    presentAddress: joi_1.default.string().required(),
    permanentAddress: joi_1.default.string().required(),
    guardian: guardianSchema.required(),
    localGuardian: localGuardianSchema.required(),
    profileImg: joi_1.default.string(),
    isActive: joi_1.default.string().uri().valid('active', 'blocked').default('active'),
});
exports.default = studentSchema;
