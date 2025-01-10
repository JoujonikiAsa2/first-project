"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRoutes = void 0;
const express_1 = require("express");
const admin_controller_1 = require("./admin.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const admin_validation_1 = require("./admin.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), admin_controller_1.adminControllers.getAllAdmin);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), admin_controller_1.adminControllers.getSingleAdmin);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), (0, validateRequest_1.default)(admin_validation_1.updateAdminValidationSchema), admin_controller_1.adminControllers.updateSingleAdmin);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.superAdmin), admin_controller_1.adminControllers.deleteSingleAdmin);
exports.adminRoutes = router;
