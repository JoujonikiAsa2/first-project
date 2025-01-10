"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enrolledCourse = void 0;
const express_1 = require("express");
const enrolledCourse_controller_1 = require("./enrolledCourse.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/create-enrolled-course', (0, auth_1.default)(user_constant_1.USER_ROLE.student), enrolledCourse_controller_1.enrolledCourseControllers.createEnrolledCourse);
router.patch('/update-course-marks', (0, auth_1.default)(user_constant_1.USER_ROLE.faculty, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.superAdmin), enrolledCourse_controller_1.enrolledCourseControllers.updateCourseMarks);
router.get('/my-enrolled-courses', (0, auth_1.default)(user_constant_1.USER_ROLE.student), enrolledCourse_controller_1.enrolledCourseControllers.getMyEnrolledCourses);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.student), enrolledCourse_controller_1.enrolledCourseControllers.getSingleEnrolledCourse);
exports.enrolledCourse = router;
