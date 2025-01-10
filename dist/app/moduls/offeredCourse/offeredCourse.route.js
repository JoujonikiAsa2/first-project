"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.offeredCourseRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const offeredCourse_controller_1 = require("./offeredCourse.controller");
const offeredCourse_validation_ts_1 = require("./offeredCourse.validation.ts");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.faculty), offeredCourse_controller_1.OfferedCourseControllers.getAllOfferedCourse);
router.get('/my-offered-courses', (0, auth_1.default)(user_constant_1.USER_ROLE.student), offeredCourse_controller_1.OfferedCourseControllers.getMyOfferedCourses);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.student), offeredCourse_controller_1.OfferedCourseControllers.getSingleOfferedCourse);
router.post('/create-offered-course', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(offeredCourse_validation_ts_1.OfferedCourseValidations.createOfferedCourseValidationSchema), offeredCourse_controller_1.OfferedCourseControllers.createOfferedCourse);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(offeredCourse_validation_ts_1.OfferedCourseValidations.updateOfferedCourseValidationSchema), offeredCourse_controller_1.OfferedCourseControllers.updateOfferedCourse);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), offeredCourse_controller_1.OfferedCourseControllers.deleteOfferedCourseFromDB);
exports.offeredCourseRoutes = router;
