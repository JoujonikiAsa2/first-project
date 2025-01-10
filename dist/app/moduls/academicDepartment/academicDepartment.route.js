"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicDepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicDepartment_validation_1 = require("./academicDepartment.validation");
const academicDepartment_controller_1 = require("./academicDepartment.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
router.post('/create-academic-department', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicDepartment_validation_1.academicDepartmentSchemaValidations.academicDepartmentSchema), academicDepartment_controller_1.academicDepartmentControllers.createAcademicDepartment);
router.get('/', academicDepartment_controller_1.academicDepartmentControllers.getAllAcademicDepartment);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicDepartment_validation_1.academicDepartmentSchemaValidations.updateAcademicDepartmentSchema), academicDepartment_controller_1.academicDepartmentControllers.updateAcademicDepartment);
exports.academicDepartmentRoutes = router;
