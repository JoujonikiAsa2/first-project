"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../moduls/user/user.model");
const auth_utils_1 = require("../moduls/auth/auth.utils");
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // check if the token send from client side
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError_1.default('You are not Authorized', http_status_1.default.UNAUTHORIZED);
        }
        // verify token
        const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_access_secret);
        const { userId, role, iat } = decoded;
        // check user exist or not
        const user = yield user_model_1.User.isUserExists(userId);
        if (!user) {
            throw new AppError_1.default('User does not found', http_status_1.default.NOT_FOUND);
        }
        //check if user is already deleted
        const deletedUser = yield user_model_1.User.isDeleted(userId);
        if (deletedUser) {
            throw new AppError_1.default('User is already deleted', http_status_1.default.FORBIDDEN);
        }
        //check is user is blocked
        const blockedUser = yield user_model_1.User.isBlocked(userId);
        if (blockedUser) {
            throw new AppError_1.default('User is blocked !!', http_status_1.default.FORBIDDEN);
        }
        //check if passwordchanged is less than or equal to iat
        if (user.passwordChangedAt && (yield user_model_1.User.isJWTIssuedBefforePasswordChanged(user === null || user === void 0 ? void 0 : user.passwordChangedAt, iat))) {
            throw new AppError_1.default('Password changed please login again', http_status_1.default.UNAUTHORIZED);
        }
        if (requiredRoles && requiredRoles.includes(role)) {
            req.user = decoded;
        }
        else {
            throw new AppError_1.default('You are not Authorized', http_status_1.default.UNAUTHORIZED);
        }
        next();
    }));
};
exports.default = auth;
