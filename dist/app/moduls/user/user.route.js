"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const faculty_validation_1 = require("../faculty/faculty.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const student_validation_1 = require("../student/student.validation");
const admin_validation_1 = require("../admin/admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("./user.constant");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/create-student', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(student_validation_1.createStudentValidationSchema), user_controller_1.userControllers.createStudent);
router.post('/create-faculty', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(faculty_validation_1.createFacultyValidationSchema), user_controller_1.userControllers.createFaculty);
router.post('/create-admin', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(admin_validation_1.createAdminValidationSchema), user_controller_1.userControllers.createAdmin);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.getAllStudent);
router.get('/me', (0, auth_1.default)(user_constant_1.USER_ROLE.student, user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.getMe);
router.get('/change-status/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.student, user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.changeStatus);
exports.userRoutes = router;
