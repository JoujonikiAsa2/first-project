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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const faculty_model_1 = __importDefault(require("./faculty.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../user/user.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const fauclty_constant_1 = require("./fauclty.constant");
const getAllFacultyIntoDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const faculty = faculty_model_1.default.find().populate('academicDepartment academicFaculty');
    const facultyQuery = new QueryBuilder_1.default(faculty, query)
        .search(fauclty_constant_1.faucltySearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield facultyQuery.modelQuery;
    const meta = yield facultyQuery.count();
    return { meta, result };
});
const getSignleFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_model_1.default.isFacultyExists(id);
    if (!existingFaculty) {
        throw new AppError_1.default('Faculty not found', http_status_1.default.NOT_FOUND);
    }
    const result = yield faculty_model_1.default.findOne({ id: id });
    return result;
});
const updateSingleFacultyIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = payload, remainingFacultyData = __rest(payload, ["name"]);
    const modifiedUpdatedData = Object.assign({}, remainingFacultyData);
    if (name && Object.keys(name).length > 0) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    // console.log(name);
    const result = yield faculty_model_1.default.findOneAndUpdate({ id: id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    // console.log(result);
    return result;
});
const deleteSingleFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const existingFaculty = yield faculty_model_1.default.isFacultyExists(id);
    const isUserExist = yield user_model_1.User.isUserExists(id);
    if ((!existingFaculty && !isUserExist) || !isUserExist) {
        throw new AppError_1.default('Faculty not found', http_status_1.default.NOT_FOUND);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const deletedFaculty = yield faculty_model_1.default.findOneAndUpdate({ id: id }, { isDeleted: true }, { new: true, session });
        if (!deletedFaculty) {
            throw new AppError_1.default('Failed to delete faculty', http_status_1.default.BAD_REQUEST);
        }
        const deletedUser = yield user_model_1.User.findOneAndUpdate({ id: id }, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError_1.default('Failed to delete faculty', http_status_1.default.BAD_REQUEST);
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedFaculty;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
});
exports.facultyServices = {
    getAllFacultyIntoDB,
    getSignleFacultyFromDB,
    updateSingleFacultyIntoDB,
    deleteSingleFacultyFromDB,
};
