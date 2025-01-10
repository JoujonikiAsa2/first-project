"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.academicSemesterRoutes = void 0;
const express_1 = __importDefault(require("express"));
const academicSemester_controller_1 = require("./academicSemester.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const academicSemester_validation_1 = require("./academicSemester.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
///router will call controller function
router.post('/create-academic-semester', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidations.academicSemesterSchema), academicSemester_controller_1.academicSemesterControllers.createAcademicSemester);
router.get('/', academicSemester_controller_1.academicSemesterControllers.getAllAcademicSemesters);
router.get('/:id', academicSemester_controller_1.academicSemesterControllers.getSingleAcademicSemester);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(academicSemester_validation_1.AcademicSemesterValidations.updateAcademicSemesterSchema), academicSemester_controller_1.academicSemesterControllers.updateAcademicSemester);
exports.academicSemesterRoutes = router;
