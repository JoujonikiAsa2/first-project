"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicFacultyRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicFaculty_controller_1 = require("./academicFaculty.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicFaculty_validation_1 = require("./academicFaculty.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.post('/create-academic-faculty', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicFaculty_validation_1.academicFacultySchemaValidation.academicFacultySchema), academicFaculty_controller_1.academicFacultyControllers.createAcademicFaculty);
router.get('/', academicFaculty_controller_1.academicFacultyControllers.getAcademicFaculty);
router.get('/:id', academicFaculty_controller_1.academicFacultyControllers.getSigngleAcademicFaculty);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicFaculty_validation_1.academicFacultySchemaValidation.updateAcademicFacultySchema), academicFaculty_controller_1.academicFacultyControllers.updateAcademicFaculty);
exports.academicFacultyRoutes = router;
