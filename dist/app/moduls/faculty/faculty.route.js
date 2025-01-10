"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRoutes = void 0;
const express_1 = require("express");
const faculty_controller_1 = require("./faculty.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const faculty_validation_1 = require("./faculty.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.faculty), faculty_controller_1.facultyControllers.getAllFaculty);
router.get('/:id', faculty_controller_1.facultyControllers.getSignleFaculty);
router.patch('/:id', (0, validateRequest_1.default)(faculty_validation_1.updateFacultyValidationSchema), faculty_controller_1.facultyControllers.updateSingleFaculty);
router.delete('/:id', faculty_controller_1.facultyControllers.deleteSingleFaculty);
exports.facultyRoutes = router;
