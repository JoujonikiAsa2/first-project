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
exports.OfferedCourseServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const semesterRegistration_model_1 = require("../semesterRegistration/semesterRegistration.model");
const offeredCourse_model_1 = require("./offeredCourse.model");
const AppError_1 = __importDefault(require("../../errors/AppError"));
const academicFaculty_model_1 = __importDefault(require("../academicFaculty/academicFaculty.model"));
const academicDepartment_model_1 = __importDefault(require("../academicDepartment/academicDepartment.model"));
const course_model_1 = __importDefault(require("../course/course.model"));
const faculty_model_1 = __importDefault(require("../faculty/faculty.model"));
const offeredCourse_utils_1 = require("./offeredCourse.utils");
const semesterRegistration_constant_1 = require("../semesterRegistration/semesterRegistration.constant");
const student_model_1 = require("../student/student.model");
const createOfferedCourseIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { semesterRegistration, academicFaculty, academicDepartment, course, faculty, section, days, startTime, endTime, } = payload;
    /**
     * Step 9: check if the faculty is available at that time. If not then throw error
     * Step 10: create the offered course
     */
    //   * Step 1: check if the semester registration id is exists!
    const isSemesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistration);
    if (!isSemesterRegistrationExists) {
        throw new AppError_1.default('Semester Registration does not exists', http_status_1.default.NOT_FOUND);
    }
    const academicSemester = isSemesterRegistrationExists.academicSemester;
    //   * Step 2: check if the academic faculty id is exists!
    const isAcademicFacultyExists = yield academicFaculty_model_1.default.findById(academicFaculty);
    if (!isAcademicFacultyExists) {
        throw new AppError_1.default('Academic faculty does not exists', http_status_1.default.NOT_FOUND);
    }
    //   * Step 3: check if the academic department id is exists!
    const isAcademicDepartmentExists = yield academicDepartment_model_1.default.findById(academicDepartment);
    if (!isAcademicDepartmentExists) {
        throw new AppError_1.default('Academic department does not exists', http_status_1.default.NOT_FOUND);
    }
    //   * Step 4: check if the course id is exists!
    const isCourseExists = yield course_model_1.default.findById(course);
    if (!isCourseExists) {
        throw new AppError_1.default('Course does not exists', http_status_1.default.NOT_FOUND);
    }
    //   * Step 5: check if the faculty id is exists!
    const isFacultyExists = yield faculty_model_1.default.findById(faculty);
    if (!isFacultyExists) {
        throw new AppError_1.default('Faculty does not exists', http_status_1.default.NOT_FOUND);
    }
    const isDepartmentBelongToFaculty = yield academicDepartment_model_1.default.findOne({
        _id: academicDepartment,
        academicFaculty,
    });
    if (!isDepartmentBelongToFaculty) {
        throw new AppError_1.default(`This ${isAcademicDepartmentExists.name} is not  belong to this ${isAcademicDepartmentExists.name}`, http_status_1.default.BAD_REQUEST);
    }
    //   * Step 7: check if the same offered course same section in same registered semester exists
    const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection = yield offeredCourse_model_1.OfferedCourse.findOne({
        semesterRegistration,
        course,
        section,
    });
    if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
        throw new AppError_1.default(`Offered course with same section is already exist!`, http_status_1.default.BAD_REQUEST);
    }
    //   * Step 8: get the schedules of the faculties
    const assignedSchedules = yield offeredCourse_model_1.OfferedCourse.find({
        semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime,
    };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(`Faculty is not available at this time!`, http_status_1.default.BAD_REQUEST);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.create(Object.assign(Object.assign({}, payload), { academicSemester }));
    return result;
});
const getAllOfferedCourseFromDB = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const OfferedCourseQuery = new QueryBuilder_1.default(offeredCourse_model_1.OfferedCourse.find().populate('academicSemester'), query)
        .filter()
        .sort()
        .paginate()
        .fields();
    const result = yield OfferedCourseQuery.modelQuery;
    const meta = yield OfferedCourseQuery.count();
    return { meta, result };
});
const getMyOfferedCoursesFromDB = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    //pagination setup
    const page = Number(query === null || query === void 0 ? void 0 : query.page) || 1;
    const limit = Number(query === null || query === void 0 ? void 0 : query.limit) || 10;
    const skip = (page - 1) * limit;
    const student = yield student_model_1.Student.findOne({ id: userId });
    // find the student
    if (!student) {
        throw new AppError_1.default('User is noty found', http_status_1.default.NOT_FOUND);
    }
    //find current ongoing semester
    const currentOngoingRegistrationSemester = yield semesterRegistration_model_1.SemesterRegistration.findOne({
        status: 'ONGOING',
    });
    if (!currentOngoingRegistrationSemester) {
        throw new AppError_1.default('There is no ongoing semester registration!', http_status_1.default.NOT_FOUND);
    }
    const aggregationQuery = [
        {
            $match: {
                semesterRegistration: currentOngoingRegistrationSemester === null || currentOngoingRegistrationSemester === void 0 ? void 0 : currentOngoingRegistrationSemester._id,
                academicFaculty: student.academicFaculty,
                academicDepartment: student.academicDepartment,
            },
        },
        {
            $lookup: {
                from: 'courses',
                localField: 'course',
                foreignField: '_id',
                as: 'course',
            },
        },
        {
            $unwind: '$course',
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentOngoingRegistrationSemester: currentOngoingRegistrationSemester._id,
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: [
                                            '$semesterRegistration',
                                            '$$currentOngoingRegistrationSemester',
                                        ],
                                    },
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isEnrolled', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'enrolledCourses',
            },
        },
        {
            $lookup: {
                from: 'enrolledcourses',
                let: {
                    currentStudent: student._id,
                },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ['$student', '$$currentStudent'],
                                    },
                                    {
                                        $eq: ['$isCompleted', true],
                                    },
                                ],
                            },
                        },
                    },
                ],
                as: 'completedCourses',
            },
        },
        {
            $addFields: {
                completedCourseIds: {
                    $map: {
                        input: '$completedCourses',
                        as: 'completed',
                        in: '$$completed.course',
                    },
                },
            },
        },
        {
            $addFields: {
                isPreRequisitesFulFilled: {
                    $or: [
                        { $eq: ['$course.preRequisiteCourses', []] },
                        {
                            $setIsSubset: [
                                '$course.preRequisiteCourses.course',
                                '$completedCourseIds',
                            ],
                        },
                    ],
                },
                isAlreadyEnrolled: {
                    $in: [
                        '$course._id',
                        {
                            $map: {
                                input: '$enrolledCourses',
                                as: 'enroll',
                                in: '$$enroll.course',
                            },
                        },
                    ],
                },
            },
        },
        {
            $match: {
                isAlreadyEnrolled: false,
                isPreRequisitesFulFilled: true,
            },
        },
    ];
    const paginationQuery = [
        {
            $skip: skip,
        },
        {
            $limit: limit,
        },
    ];
    const result = yield offeredCourse_model_1.OfferedCourse.aggregate([
        ...aggregationQuery,
        ...paginationQuery,
    ]);
    const total = (yield offeredCourse_model_1.OfferedCourse.aggregate(aggregationQuery)).length;
    const totalPage = Math.ceil(result.length / limit);
    return {
        meta: {
            page,
            limit,
            total,
            totalPage,
        },
        result,
    };
});
const getSingleOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield offeredCourse_model_1.OfferedCourse.findById(id).populate('academicSemester');
    return result;
});
const updateOfferedCourseIntoDB = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { faculty, days, startTime, endTime } = payload;
    //check if the offered course is exist
    const offeredCourse = yield offeredCourse_model_1.OfferedCourse.findById(id);
    if (!offeredCourse) {
        throw new AppError_1.default('Offered course not found', http_status_1.default.NOT_FOUND);
    }
    //check if the faculty is exist
    const isFacultyExist = yield faculty_model_1.default.findById(faculty);
    if (!isFacultyExist) {
        throw new AppError_1.default('Faculty not found', http_status_1.default.NOT_FOUND);
    }
    //check if the semesterRegistration is exist
    const semesterRegistrationExists = yield semesterRegistration_model_1.SemesterRegistration.findById(offeredCourse.semesterRegistration);
    if ((semesterRegistrationExists === null || semesterRegistrationExists === void 0 ? void 0 : semesterRegistrationExists.status) !== semesterRegistration_constant_1.RegistrationStatus.UPCOMING) {
        throw new AppError_1.default(`${semesterRegistrationExists === null || semesterRegistrationExists === void 0 ? void 0 : semesterRegistrationExists.status} status can not be updated`, http_status_1.default.NOT_FOUND);
    }
    const assignedSchedules = yield offeredCourse_model_1.OfferedCourse.find({
        semesterRegistration: offeredCourse.semesterRegistration,
        faculty,
        days: { $in: days },
    }).select('days startTime endTime');
    const newSchedule = {
        days,
        startTime,
        endTime,
    };
    if ((0, offeredCourse_utils_1.hasTimeConflict)(assignedSchedules, newSchedule)) {
        throw new AppError_1.default(`Faculty is not available at this time!`, http_status_1.default.BAD_REQUEST);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndUpdate(id, payload, {
        new: true,
    });
    return result;
});
const deleteOfferedCourseFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = yield offeredCourse_model_1.OfferedCourse.findById(id);
    if (!isOfferedCourseExists) {
        throw new AppError_1.default('Offered Course not found', http_status_1.default.NOT_FOUND);
    }
    const semesterRegistation = isOfferedCourseExists.semesterRegistration;
    const semesterRegistrationStatus = yield semesterRegistration_model_1.SemesterRegistration.findById(semesterRegistation).select('status');
    if ((semesterRegistrationStatus === null || semesterRegistrationStatus === void 0 ? void 0 : semesterRegistrationStatus.status) !== 'UPCOMING') {
        throw new AppError_1.default(`Offered course can not update ! because the semester ${semesterRegistrationStatus}`, http_status_1.default.BAD_REQUEST);
    }
    const result = yield offeredCourse_model_1.OfferedCourse.findByIdAndDelete(id);
    return result;
});
exports.OfferedCourseServices = {
    createOfferedCourseIntoDB,
    getAllOfferedCourseFromDB,
    getMyOfferedCoursesFromDB,
    getSingleOfferedCourseFromDB,
    updateOfferedCourseIntoDB,
    deleteOfferedCourseFromDB,
};
