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
exports.SemesterRegistrationServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const semesterRegistration_model_1 = require("./semesterRegistration.model");
const academicSemester_model_1 = require("../academicSemester/academicSemester.model");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const semesterRegistration_constant_1 = require("./semesterRegistration.constant");
const offeredCourse_model_1 = require("../offeredCourse/offeredCourse.model");
const mongoose_1 = __importDefault(require("mongoose"));
const createSemesterRegistrationIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const academicSemester = payload === null || payload === void 0 ? void 0 : payload.academicSemester;
    //check if there any registered semester that is already UPCOMING | ONGOING
    const isThereAnyUpcomingOrOngoingSEmester = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        $or: [{ status: semesterRegistration_constant_1.RegistrationStatus.UPCOMING }, { status: semesterRegistration_constant_1.RegistrationStatus.ONGOING }],
    });
    if (isThereAnyUpcomingOrOngoingSEmester) {
        throw new AppError_1.default(`There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`, http_status_1.default.BAD_REQUEST);
    }
    // check if the semester is exist
    const isAcademicSemesterExists = yield academicSemester_model_1.AcademicSemester.findById(academicSemester);
    if (!isAcademicSemesterExists) {
        throw new AppError_1.default('This academic semester not found !', http_status_1.default.NOT_FOUND);
    }
    // check if the semester is already registered!
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        academicSemester,
    });
    if (isSemesterRegistrationExists) {
        throw new AppError_1.default('This semester is already registered!', http_status_1.default.CONFLICT);
    }
    const result = yield semesterRegistration_model_1.SemesterRegistration.create(payload);
    return result;
});
const getAllSemesterRegistrationFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const semesterRegistrationQuery = new QueryBuilder_1.default(semesterRegistration_model_1.SemesterRegistration.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield semesterRegistrationQuery.modelQuery;
    const meta = yield semesterRegistrationQuery.count();
    return { meta, result };
});
const getSingleSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield semesterRegistration_model_1.SemesterRegistration.findById(id).populate('academicSemester');
    return result;
});
const updateSemesterRegistrationIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const requestedStatus = payload.status;
    // if the semester registration is exists
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default('Semester registration not found !', http_status_1.default.NOT_FOUND);
    }
    //  if the requested semester registration is ended we will not update anything
    const currentSemesterStatus = isSemesterRegistrationExists === null || isSemesterRegistrationExists === void 0 ? void 0 : isSemesterRegistrationExists.status;
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.ENDED) {
        throw new AppError_1.default('You cannot update an ended semester registration', http_status_1.default.BAD_REQUEST);
    }
    // UPCOMING ---> ONGOING ---> ENDED
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.UPCOMING && requestedStatus === semesterRegistration_constant_1.RegistrationStatus.ENDED) {
        throw new AppError_1.default(`You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}!`, http_status_1.default.BAD_REQUEST);
    }
    if (currentSemesterStatus === semesterRegistration_constant_1.RegistrationStatus.ONGOING && requestedStatus === semesterRegistration_constant_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(`You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}!`, http_status_1.default.BAD_REQUEST);
    }
    const result = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true,
    });
    return result;
});
const deleteSemesterRegistrationFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    /**
    * Step1: Delete associated offered courses.
    * Step2: Delete semester registraton when the status is
    'UPCOMING'.
    **/
    // checking if the semester registration is exist
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(id);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default('This registered semester is not found !', http_status_1.default.NOT_FOUND);
    }
    // checking if the status is still "UPCOMING"
    const semesterRegistrationStatus = isSemesterRegistrationExists.status;
    if (semesterRegistrationStatus !== 'UPCOMING') {
        throw new AppError_1.default(`You can not update as the registered semester is ${semesterRegistrationStatus}`, http_status_1.default.BAD_REQUEST);
    }
    const session = yield mongoose_1.default.startSession();
    //deleting associated offered courses
    try {
        session.startTransaction();
        const deletedOfferedCourse = yield offeredCourse_model_1.OfferedCourse.deleteMany({
            semesterRegistration: id,
        }, {
            session,
        });
        if (!deletedOfferedCourse) {
            throw new AppError_1.default('Failed to delete semester registration !', http_status_1.default.BAD_REQUEST);
        }
        const deletedSemisterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findByIdAndDelete(id, {
            session,
            new: true,
        });
        if (!deletedSemisterRegistration) {
            throw new AppError_1.default('Failed to delete semester registration !', http_status_1.default.BAD_REQUEST);
        }
        yield session.commitTransaction();
        yield session.endSession();
        return null;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
exports.SemesterRegistrationServices = {
    createSemesterRegistrationIntoDB,
    getAllSemesterRegistrationFromDB,
    getSingleSemesterRegistrationFromDB,
    updateSemesterRegistrationIntoDB,
    deleteSemesterRegistrationFromDB
};
