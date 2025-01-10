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
exports.StudentService = void 0;
/* eslint-disable @typescript-eslint/no-unused-vars */
const mongoose_1 = __importDefault(require("mongoose"));
const student_model_1 = require("./student.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../user/user.model");
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const student_constant_1 = require("./student.constant");
const getAllStudentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Base query:', query);
    // const queryObject = { ...query };
    // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
    // let searchTerm = '';
    // if (query?.searchTerm) {
    //   searchTerm = query?.searchTerm as string;
    // }
    // const searchQuery = Student.find({
    //   $or: studentSearchableFields.map((field) => {
    //     return {
    //       [field]: {
    //         $regex: searchTerm,
    //         $options: 'i',
    //       },
    //     };
    //   }),
    // });
    // //Filtering
    // const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'skip', 'fields'];
    // excludedFields.forEach((el) => delete queryObject[el]);
    // console.log('Query:', queryObject);
    // Final execution
    // const filterQuery = searchQuery
    //   .find(queryObject)
    //   .populate('admissionSemester')
    //   .populate({
    //     path: 'academicDepartment',
    //     populate: {
    //       path: 'academicFaculty',
    //     },
    //   });
    // let sort = '-createdAt';
    // if (query.sort) {
    //   sort = query.sort as string;
    // }
    // const sortQuery = filterQuery.sort(sort);
    // let page = 1
    // let limit = 1
    // let skip = 0
    // if (query.limit) {
    //   limit = Number(query.limit)
    // }
    // if(query.page){
    //   page = Number(query.page)
    //   skip = (page - 1) * limit
    // }
    // const paginateQuery =  sortQuery.limit(limit);
    // const limitQuery =  paginateQuery.skip(limit);
    // let fields = '-__v';
    // if (query.fields) {
    //   fields = (query.fields as string).split(',').join(' ');
    //   console.log(fields)
    // }
    // const fieldsQuery =  limitQuery.select(fields);
    // return fieldsQuery;
    const studentQuery = new QueryBuilder_1.default(//call the class
    student_model_1.Student.find()
        .populate('user')
        .populate('admissionSemester')
        .populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    }), query)
        .search(student_constant_1.studentSearchableFields)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield studentQuery.modelQuery;
    const meta = yield studentQuery.count();
    return {
        result,
        meta,
    };
});
// const getSingleStudentFromDB = async (id: string) => {
//   const result = await Student.aggregate([{$match: {id:id}}]);
//   return result;
// };
const getSingleStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isStudentExist = yield student_model_1.Student.isStudentExists(id);
    console.log(isStudentExist);
    if (!isStudentExist) {
        throw new AppError_1.default('Student not found', http_status_1.default.NOT_FOUND);
    }
    const result = yield student_model_1.Student.findOne({ id: id })
        .populate('admissionSemester')
        .populate({
        path: 'academicDepartment',
        populate: {
            path: 'academicFaculty',
        },
    });
    return result;
});
const deleteStudentFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    //use static method
    const isStudentExist = yield student_model_1.Student.isStudentExists(id);
    const isUserExist = yield user_model_1.User.isUserExists(id);
    if ((!isStudentExist && !isUserExist) || !isUserExist) {
        throw new AppError_1.default('Student not found', http_status_1.default.NOT_FOUND);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        yield session.startTransaction();
        const deletedStudent = yield student_model_1.Student.findOneAndUpdate({ id: id }, { isDeleted: true }, { new: true, session });
        if (!deletedStudent) {
            throw new AppError_1.default('Failed to delete student', http_status_1.default.BAD_REQUEST);
        }
        const deletedUser = yield user_model_1.User.findOneAndUpdate({ id: id }, { isDeleted: true }, { new: true, session });
        if (!deletedUser) {
            throw new AppError_1.default('Failed to delete user', http_status_1.default.BAD_REQUEST);
        }
        yield session.commitTransaction();
        yield session.endSession();
        return deletedStudent;
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new AppError_1.default('Failed to delete student', http_status_1.default.BAD_REQUEST);
    }
});
const updateStudentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, guardian, localGuardian } = payload, remainingStudentData = __rest(payload, ["name", "guardian", "localGuardian"]);
    const modifiedUpdatedData = Object.assign({}, remainingStudentData);
    if (name && Object.keys(name).length > 0) {
        for (const [key, value] of Object.entries(name)) {
            modifiedUpdatedData[`name.${key}`] = value;
        }
    }
    if (guardian && Object.keys(guardian).length > 0) {
        for (const [key, value] of Object.entries(guardian)) {
            modifiedUpdatedData[`guardian.${key}`] = value;
        }
    }
    if (localGuardian && Object.keys(localGuardian).length > 0) {
        for (const [key, value] of Object.entries(localGuardian)) {
            modifiedUpdatedData[`localGuardian.${key}`] = value;
        }
    }
    const result = yield student_model_1.Student.findOneAndUpdate({ id: id }, modifiedUpdatedData, {
        new: true,
        runValidators: true,
    });
    return result;
});
exports.StudentService = {
    getAllStudentFromDB,
    getSingleStudentFromDB,
    deleteStudentFromDB,
    updateStudentIntoDB,
};
