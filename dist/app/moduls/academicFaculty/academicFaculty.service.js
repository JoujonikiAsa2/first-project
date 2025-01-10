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
exports.academicFacultyServices = void 0;
const academicFaculty_model_1 = __importDefault(require("./academicFaculty.model"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createAcademicFacultyIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.default.create(payload);
    return result;
});
const getAcademicFacultyFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const academicFacultyQuery = new QueryBuilder_1.default(academicFaculty_model_1.default.find(), query)
        .search(['name'])
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield academicFacultyQuery.modelQuery;
    const meta = yield academicFacultyQuery.count();
    return { meta, result };
});
const getSingleAcademicFacultyFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.default.findById(id);
    return result;
});
const updateAcademicFacultyIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield academicFaculty_model_1.default.findOneAndUpdate({ _id: id }, payload, {
        new: true,
    });
    return result;
});
exports.academicFacultyServices = {
    createAcademicFacultyIntoDB,
    getAcademicFacultyFromDB,
    getSingleAcademicFacultyFromDB,
    updateAcademicFacultyIntoDB,
};
