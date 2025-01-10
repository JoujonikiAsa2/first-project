"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    id: zod_1.z.string(),
    password: zod_1.z.string().max(20, { message: 'Password cannot exceed 20 characters' }),
});
exports.default = userValidationSchema;
