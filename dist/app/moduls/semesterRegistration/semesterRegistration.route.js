"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.semesterRegistrationRoutes = void 0;
const express_1 = require("express");
const semesterRegistration_controller_1 = require("./semesterRegistration.controller");
const semesterRegistration_validation_1 = require("./semesterRegistration.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/create-semester-registration', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.createSemesterRegistrationValidationSchema), semesterRegistration_controller_1.semesterRegistrationController.createSemesterRegistration);
router.get('/', semesterRegistration_controller_1.semesterRegistrationController.getAllSemesterRegistration);
router.get('/:id', semesterRegistration_controller_1.semesterRegistrationController.getSingleSemesterRegistration);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(semesterRegistration_validation_1.SemesterRegistrationValidations.upadateSemesterRegistrationValidationSchema), semesterRegistration_controller_1.semesterRegistrationController.updateSemesterRegistration);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin, user_constant_1.USER_ROLE.admin), semesterRegistration_controller_1.semesterRegistrationController.deleteSemesterRegistration);
exports.semesterRegistrationRoutes = router;
