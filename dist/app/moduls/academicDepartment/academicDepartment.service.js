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
exports.AcademicDepartmentServices = void 0;
const academicDepartment_model_1 = __importDefault(require("./academicDepartment.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const academicFaculty_model_1 = __importDefault(require("../academicFaculty/academicFaculty.model"));
const createAcademicDepartmentIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    //check if the academic faculty is exist
    const isAcademicFacultyExist = yield academicFaculty_model_1.default.findById(payload.academicFaculty);
    if (!isAcademicFacultyExist) {
        throw new Error('Academic Faculty not found');
    }
    const result = yield academicDepartment_model_1.default.create(payload);
    return result;
});
const getAllAcademicDepartmentFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const academicFacultyQuery = new QueryBuilder_1.default(academicDepartment_model_1.default.find().populate('academicFaculty'), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield academicFacultyQuery.modelQuery;
    const meta = yield academicFacultyQuery.count();
    return { meta, result };
});
const updateAcademicDepartmentIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicDepartment_model_1.default.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
exports.AcademicDepartmentServices = {
    createAcademicDepartmentIntoDB,
    getAllAcademicDepartmentFromDB,
    updateAcademicDepartmentIntoDB,
};
