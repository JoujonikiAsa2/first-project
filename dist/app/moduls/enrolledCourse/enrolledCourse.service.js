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
exports.enrolledCourseServices = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const offeredCourse_model_1 = require("../offeredCourse/offeredCourse.model");
const student_model_1 = require("../student/student.model");
const enrolledCourse_model_1 = require("./enrolledCourse.model");
const mongoose_1 = __importDefault(require("mongoose"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const course_model_1 = __importDefault(require("../course/course.model"));
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const enrolledCourse_utils_1 = require("./enrolledCourse.utils");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createEnrolledCourseIntoDB = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { offeredCourse } = payload;
    //check if the offered course exists
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.findById(payload.offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default('Offered course does not exist', http_status_1.default.NOT_FOUND);
    }
    const { semesterRegistration, academicSemester, academicFaculty, academicDepartment, course, faculty, } = isOfferedCourseExists;
    //if max capacity exceeded
    if (isOfferedCourseExists.maxCapacity <= 0) {
        throw new AppError_1.default('Enrolled students capacity exceeded', http_status_1.default.BAD_GATEWAY);
    }
    //check if the student exists
    const student = yield student_model_1.Student.findOne({ id: userId });
    if (!student) {
        throw new AppError_1.default('Student does not exist', http_status_1.default.NOT_FOUND);
    }
    //check if the student already enrolled
    const isStudentAlreadyEnrolled = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration: isOfferedCourseExists === null || isOfferedCourseExists === void 0 ? void 0 : isOfferedCourseExists.semesterRegistration,
        offeredCourse,
        student: student === null || student === void 0 ? void 0 : student._id,
    });
    if (isStudentAlreadyEnrolled) {
        throw new AppError_1.default('Student already enrolled', http_status_1.default.CONFLICT);
    }
    //current course credit
    // check total credits exceeds maxCredit
    const currentCourse = yield course_model_1.default.findById(isOfferedCourseExists.course);
    const currentCredit = currentCourse === null || currentCourse === void 0 ? void 0 : currentCourse.credit;
    const offeredCourseSemesterRegistration = yield semesterRegistration_model_1.SemesterRegistration.findById(isOfferedCourseExists.semesterRegistration).select('maxCredit');
    const maxCredit = offeredCourseSemesterRegistration === null || offeredCourseSemesterRegistration === void 0 ? void 0 : offeredCourseSemesterRegistration.maxCredit;
    const enrolledCourses = yield enrolledCourse_model_1.EnrolledCourse.aggregate([
        {
            $match: {
                semesterRegistration: semesterRegistration,
                student: student === null || student === void 0 ? void 0 : student._id,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'enrolledCourseData',
            },
        },
        {
            $unwind: '$enrolledCourseData',
        },
        {
            $group: {
                _id: null,
                totalEnrolledCredits: {
                    $sum: '$enrolledCourseData.credit',
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalEnrolledCredits: 1,
            },
        },
    ]);
    const totalCredits = enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;
    if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
        throw new AppError_1.default('Total enrolled credits exceeds maxCredit', http_status_1.default.BAD_REQUEST);
    }
    const session = yield mongoose_1.default.startSession();
    try {
        session.startTransaction();
        const result = yield enrolledCourse_model_1.EnrolledCourse.create([
            {
                semesterRegistration: semesterRegistration,
                academicSemester: academicSemester,
                academicFaculty: academicFaculty,
                academicDepartment: academicDepartment,
                offeredCourse: offeredCourse,
                course: course,
                student: student._id,
                faculty: faculty,
                isEnrolled: true,
            },
        ], { session });
        if (!result) {
            throw new AppError_1.default('Failed to enroll in this cousre !', http_status_1.default.BAD_REQUEST);
        }
        const maxCapacity = isOfferedCourseExists.maxCapacity;
        yield offeredCourse_model_1.OfferedCourse.findByIdAndUpdate(offeredCourse, {
            maxCapacity: maxCapacity - 1,
        });
        yield session.commitTransaction();
        yield session.endSession();
        return result;
    }
    catch (err) {
        yield session.abortTransaction();
        yield session.endSession();
        throw new Error(err);
    }
});
const getSignlenrolledCourseFromDB = () => __awaiter(void 0, void 0, void 0, function* () { });
const getMyEnrolledCoursesFromDB = (studentId, query) => __awaiter(void 0, void 0, void 0, function* () {
    const student = yield student_model_1.Student.findOne({ id: studentId });
    if (!student) {
        throw new AppError_1.default('Student not found !', http_status_1.default.NOT_FOUND);
    }
    const enrolledCourseQuery = new QueryBuilder_1.default(enrolledCourse_model_1.EnrolledCourse.find({ student: student._id }).populate('semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield enrolledCourseQuery.modelQuery;
    const meta = yield enrolledCourseQuery.count();
    return {
        meta,
        result,
    };
});
const updateCourseMarksIntoDB = (facultyId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, offeredCourse, student, courseMarks } = payload;
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default('Semester registration not found !', http_status_1.default.NOT_FOUND);
    }
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.findById(offeredCourse);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default('Offered course not found !', http_status_1.default.NOT_FOUND);
    }
    const isStudentExists = yield student_model_1.Student.findById(student);
    if (!isStudentExists) {
        throw new AppError_1.default('Student not found !', http_status_1.default.NOT_FOUND);
    }
    const faculty = yield faculty_model_1.default.findOne({ id: facultyId }, { _id: 1 });
    if (!faculty) {
        throw new AppError_1.default('Faculty not found !', http_status_1.default.NOT_FOUND);
    }
    const isCourseBelongToFaculty = yield enrolledCourse_model_1.EnrolledCourse.findOne({
        semesterRegistration,
        offeredCourse,
        student,
        faculty: faculty._id,
    });
    if (!isCourseBelongToFaculty) {
        throw new AppError_1.default('You are forbidden! !', http_status_1.default.FORBIDDEN);
    }
    const modifiedData = Object.assign({}, courseMarks);
    if (courseMarks === null || courseMarks === void 0 ? void 0 : courseMarks.finalTerm) {
        const { classTest1, classTest2, midTerm, finalTerm } = isCourseBelongToFaculty.courseMarks;
        const totalMarks = Math.ceil(classTest1 * 0.1) +
            Math.ceil(midTerm * 0.3) +
            Math.ceil(classTest2 * 0.1) +
            Math.ceil(finalTerm * 0.5);
        const result = (0, enrolledCourse_utils_1.calculateGradeAndPoints)(totalMarks);
        modifiedData.grade = result.grade;
        modifiedData.gradePoints = result.gradePoints;
        modifiedData.isCompleted = true;
    }
    if (courseMarks && Object.keys(courseMarks).length) {
        for (const [key, value] of Object.entries(courseMarks)) {
            modifiedData[`courseMarks.${key}`] = value;
        }
    }
    const result = yield enrolledCourse_model_1.EnrolledCourse.findByIdAndUpdate(isCourseBelongToFaculty._id, modifiedData, {
        new: true,
    });
    return result;
});
exports.enrolledCourseServices = {
    createEnrolledCourseIntoDB,
    getSignlenrolledCourseFromDB,
    getMyEnrolledCoursesFromDB,
    updateCourseMarksIntoDB,
};
