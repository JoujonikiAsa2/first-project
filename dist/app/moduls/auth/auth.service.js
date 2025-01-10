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
exports.authServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const auth_utils_1 = require("./auth.utils");
const sendEmail_1 = require("../../utils/sendEmail");
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, password } = payload;
    // check user exist or not
    const user = yield user_model_1.User.isUserExists(id);
    if (!user) {
        throw new AppError_1.default('User does not found', http_status_1.default.NOT_FOUND);
    }
    //check if user is already deleted
    const deletedUser = yield user_model_1.User.isDeleted(id);
    if (deletedUser) {
        throw new AppError_1.default('User is already deleted', http_status_1.default.FORBIDDEN);
    }
    //check is user is blocked
    const blockedUser = yield user_model_1.User.isBlocked(id);
    if (blockedUser) {
        throw new AppError_1.default('User is blocked', http_status_1.default.FORBIDDEN);
    }
    // compare password with hash password
    const passwordMatch = yield user_model_1.User.isPasswordMatch(password, user === null || user === void 0 ? void 0 : user.password);
    // if password does not match
    if (!passwordMatch) {
        throw new AppError_1.default('Password does not match', http_status_1.default.FORBIDDEN);
    }
    //jwt payload
    const jwtPayload = {
        userId: user === null || user === void 0 ? void 0 : user.id,
        role: user === null || user === void 0 ? void 0 : user.role,
    };
    //create token and send it to the user
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire_in);
    //create token and send it to the user
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expire_in);
    return {
        accessToken,
        refreshToken,
        needPasswordChange: user === null || user === void 0 ? void 0 : user.needsPasswordChange,
    };
});
const changePassword = (userData, payload) => __awaiter(void 0, void 0, void 0, function* () {
    // check user exist or not
    const user = yield user_model_1.User.isUserExists(userData === null || userData === void 0 ? void 0 : userData.userId);
    if (!user) {
        throw new AppError_1.default('User does not found', http_status_1.default.NOT_FOUND);
    }
    //check if user is already deleted
    const deletedUser = yield user_model_1.User.isDeleted(userData === null || userData === void 0 ? void 0 : userData.userId);
    if (deletedUser) {
        throw new AppError_1.default('User is already deleted', http_status_1.default.FORBIDDEN);
    }
    //check is user is blocked
    const blockedUser = yield user_model_1.User.isBlocked(userData === null || userData === void 0 ? void 0 : userData.userId);
    if (blockedUser) {
        throw new AppError_1.default('User is blocked', http_status_1.default.FORBIDDEN);
    }
    //check if password is match
    const passwordMatch = yield user_model_1.User.isPasswordMatch(payload === null || payload === void 0 ? void 0 : payload.oldPassword, //plain text pass
    user === null || user === void 0 ? void 0 : user.password);
    if (!passwordMatch) {
        throw new AppError_1.default('Password does not match', http_status_1.default.FORBIDDEN);
    }
    //hash new password
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    yield user_model_1.User.findOneAndUpdate({
        id: userData.userId,
        role: userData.role,
    }, {
        password: hashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
    return null;
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the given token is valid
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    const { userId, iat } = decoded;
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExists(userId);
    if (!user) {
        throw new AppError_1.default('This user is not found !', http_status_1.default.NOT_FOUND);
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default('This user is deleted !', http_status_1.default.FORBIDDEN);
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default('This user is blocked ! !', http_status_1.default.FORBIDDEN);
    }
    if (user.passwordChangedAt &&
        (yield user_model_1.User.isJWTIssuedBefforePasswordChanged(user.passwordChangedAt, iat))) {
        throw new AppError_1.default('You are not authorized !', http_status_1.default.UNAUTHORIZED);
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expire_in);
    return {
        accessToken,
    };
});
const forgetPassword = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExists(id);
    if (!user) {
        throw new AppError_1.default('This user is not found !', http_status_1.default.NOT_FOUND);
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default('This user is deleted !', http_status_1.default.FORBIDDEN);
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default('This user is blocked ! !', http_status_1.default.FORBIDDEN);
    }
    const jwtPayload = {
        userId: user.id,
        role: user.role,
    };
    const resetToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, '10m');
    const resetURLlink = `${config_1.default.reset_pass_ui_link}?id=${user.id}&token=${resetToken}`;
    (0, sendEmail_1.sendEmail)(user === null || user === void 0 ? void 0 : user.email, resetURLlink);
});
const resetPassword = (payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    // checking if the user is exist
    const user = yield user_model_1.User.isUserExists(payload.id);
    if (!user) {
        throw new AppError_1.default('This user is not found !', http_status_1.default.NOT_FOUND);
    }
    // checking if the user is already deleted
    const isDeleted = user === null || user === void 0 ? void 0 : user.isDeleted;
    if (isDeleted) {
        throw new AppError_1.default('This user is deleted !', http_status_1.default.FORBIDDEN);
    }
    // checking if the user is blocked
    const userStatus = user === null || user === void 0 ? void 0 : user.status;
    if (userStatus === 'blocked') {
        throw new AppError_1.default('This user is blocked ! !', http_status_1.default.FORBIDDEN);
    }
    const decoded = (0, auth_utils_1.verifyToken)(token, config_1.default.jwt_refresh_secret);
    if (payload.id !== decoded.userId) {
        throw new AppError_1.default('Forbidden access', http_status_1.default.FORBIDDEN);
    }
    const hashedPassword = yield bcrypt_1.default.hash(payload.newPassword, Number(config_1.default.bcrypt_salt_rounds));
    // https://localhost:5000?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzQ5NjEzODYsImV4cCI6MTczNDk2MTk4Nn0.IlReXCSsRlXTNOI5G3k6A8wCfucqXwzXr7f0F8qJdZk?id=A-0001&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJBLTAwMDEiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MzQ5NjMzMjIsImV4cCI6MTczNDk2MzkyMn0.DKoS82Ilzg7bv8-eOcGOKdsstno3Xpr7kMCyvR0jbus
    yield user_model_1.User.findOneAndUpdate({
        id: decoded.userId,
        role: decoded.role,
    }, {
        password: hashedPassword,
        needsPasswordChange: false,
        passwordChangedAt: new Date(),
    }, {
        new: true,
    });
});
exports.authServices = {
    loginUser,
    changePassword,
    refreshToken,
    forgetPassword,
    resetPassword,
};
