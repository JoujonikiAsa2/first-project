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
exports.UserServices = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("../../config"));
const student_model_1 = require("../student/student.model");
const academicSemester_model_1 = require("./../academicSemester/academicSemester.model");
const user_model_1 = require("./user.model");
const user_utils_1 = require("./user.utils");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const admin_model_1 = __importDefault(require("../admin/admin.model"));
const faculty_util_1 = require("../faculty/faculty.util");
const admin_util_1 = require("../admin/admin.util");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const academicDepartment_model_1 = __importDefault(require("../academicDepartment/academicDepartment.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const academicFaculty_model_1 = __importDefault(require("../academicFaculty/academicFaculty.model"));
const createStudentIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // create a user object
    const userData = {};
    //if password is not given , use deafult password
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'student';
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    // find academic semester info
    const admissionSemester = yield academicSemester_model_1.AcademicSemester.findById(payload.admissionSemester);
    if (!admissionSemester) {
        throw new AppError_1.default('Academic Semester not found', http_status_1.default.NOT_FOUND);
    }
    // find department
    const academicDepartment = yield academicDepartment_model_1.default.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError_1.default('Aademic department not found', http_status_1.default.BAD_REQUEST);
    }
    const academicFaculty = yield academicFaculty_model_1.default.findById(academicDepartment.academicFaculty);
    //create a isolated environment
    const session = yield mongoose_1.default.startSession();
    //use transaction
    try {
        //start the session
        session.startTransaction();
        //set  generated id
        userData.id = yield (0, user_utils_1.generateStudentId)(admissionSemester);
        // create a user
        if (file) {
            //image name
            const imageName = `${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}-${userData.id}`;
            const path = file === null || file === void 0 ? void 0 : file.path;
            //send image to cloudinary
            const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
            payload.profileImg = secure_url;
        }
        const newUser = yield user_model_1.User.create([userData], { session });
        //create a student
        if (!newUser.length) {
            throw new AppError_1.default('Failed to create user', http_status_1.default.BAD_REQUEST);
        }
        // set id , _id as user
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id; //reference _id
        payload.academicFaculty = academicFaculty === null || academicFaculty === void 0 ? void 0 : academicFaculty._id;
        const newStudent = yield student_model_1.Student.create([payload], { session });
        if (!newStudent.length) {
            throw new AppError_1.default('Failed to create student', http_status_1.default.BAD_REQUEST);
        }
        //commit the transaction
        yield session.commitTransaction();
        //end the session
        session.endSession();
        return newStudent;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const createFacultyIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // console.log('Payloads:', payload);
    // create a user object
    const userData = {};
    userData.password = password || config_1.default.default_pass;
    //set student role
    userData.role = 'faculty';
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    // find department
    const academicDepartment = yield academicDepartment_model_1.default.findById(payload.academicDepartment);
    if (!academicDepartment) {
        throw new AppError_1.default('Aademic department not found', http_status_1.default.BAD_REQUEST);
    }
    const academicFaculty = yield academicFaculty_model_1.default.findById(academicDepartment.academicFaculty);
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        //set generated id
        userData.id = yield (0, faculty_util_1.generateFacultyId)();
        if (file) {
            //image name
            const imageName = `${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}-${userData.id}`;
            const path = file.path;
            //send image to cloudinary
            const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
            payload.profileImg = secure_url;
        }
        const newUser = yield user_model_1.User.create([userData], { session });
        // console.log('User Created:', newUser);
        if (!newUser.length) {
            throw new AppError_1.default('Failed to create user', http_status_1.default.BAD_REQUEST);
        }
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        payload.academicFaculty = academicFaculty === null || academicFaculty === void 0 ? void 0 : academicFaculty._id;
        const newFaculty = yield faculty_model_1.default.create([payload], { session });
        if (!newFaculty.length) {
            throw new AppError_1.default('Failed to create student', http_status_1.default.BAD_REQUEST);
        }
        yield session.commitTransaction();
        //end the session
        session.endSession();
        return newFaculty;
    }
    catch (error) {
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const createAdminIntoDB = (file, password, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //create a empty user data
    const userData = {};
    userData.password = password || config_1.default.default_pass;
    userData.role = 'admin';
    userData.email = payload === null || payload === void 0 ? void 0 : payload.email;
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        userData.id = yield (0, admin_util_1.generateAdminId)();
        if (file) {
            //image name
            const imageName = `${(_a = payload === null || payload === void 0 ? void 0 : payload.name) === null || _a === void 0 ? void 0 : _a.firstName}-${userData.id}`;
            const path = file.path;
            //send image to cloudinary
            const { secure_url } = (yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path));
            payload.profileImg = secure_url;
        }
        const newUser = yield user_model_1.User.create([userData], { session });
        // console.log('User',newUser)
        if (!newUser) {
            throw new AppError_1.default('Failed to creare user', http_status_1.default.BAD_REQUEST);
        }
        // console.log('Admin',payload)
        payload.id = newUser[0].id;
        payload.user = newUser[0]._id;
        const newAdmin = yield admin_model_1.default.create([payload], { session });
        if (!newAdmin) {
            throw new AppError_1.default('Failed to creare admin', http_status_1.default.BAD_REQUEST);
        }
        yield session.commitTransaction();
        session.endSession();
        return newAdmin;
    }
    catch (err) {
        yield session.abortTransaction();
        session.endSession();
        throw err;
    }
});
const getAllUsersFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userQuery = new QueryBuilder_1.default(user_model_1.User.find(), query);
    const result = yield userQuery.modelQuery;
    const meta = yield userQuery.count();
    return { meta, result };
});
const getMe = (userId, role) => __awaiter(void 0, void 0, void 0, function* () {
    let result = null;
    if (role === 'student') {
        result = yield student_model_1.Student.findOne({ id: userId });
    }
    if (role === 'admin') {
        result = yield admin_model_1.default.findOne({ id: userId });
    }
    if (role === 'faculty') {
        result = yield faculty_model_1.default.findOne({ id: userId });
    }
    return result;
});
const changeStatus = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    return result;
});
exports.UserServices = {
    createStudentIntoDB,
    getAllUsersFromDB,
    createFacultyIntoDB,
    createAdminIntoDB,
    getMe,
    changeStatus,
};
