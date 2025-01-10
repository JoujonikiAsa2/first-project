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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const userSchema = new mongoose_1.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        select: 0,
    },
    passwordChangedAt: {
        type: Date,
    },
    needsPasswordChange: {
        type: Boolean,
        default: true,
    },
    role: {
        type: String,
        enum: ['superAdmin', 'student', 'faculty', 'admin'],
        required: true,
    },
    status: {
        type: String,
        enum: ['in-progress', 'blocked'],
        default: 'in-progress',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
//static method for checking if user is exists
userSchema.statics.isUserExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingUser = yield exports.User.findOne({ id: id }).select('+password');
        return existingUser;
    });
};
//static method for checking if user is deleted
userSchema.statics.isDeleted = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserDeleted = yield exports.User.findOne({ id: id, isDeleted: true });
        return isUserDeleted;
    });
};
//static method for checking if user is blocked
userSchema.statics.isBlocked = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isUserBlocked = yield exports.User.findOne({ id: id, status: 'blocked' });
        return isUserBlocked;
    });
};
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this; // doc
        // hashing password and save into DB
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
userSchema.statics.isPasswordMatch = function (password, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(password, hashPassword);
    });
};
userSchema.statics.isJWTIssuedBefforePasswordChanged = function (passwordChangedTimestamp, JWTIssuedTimestamp) {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
        return passwordChangedTime > JWTIssuedTimestamp;
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
