"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrolledCourse = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enrolledCourse_constant_1 = require("./enrolledCourse.constant");
const courseMarks = new mongoose_1.default.Schema({
    classTest1: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    midTerm: {
        type: Number,
        min: 0,
        max: 30,
        default: 0,
    },
    classTest2: {
        type: Number,
        min: 0,
        max: 10,
        default: 0,
    },
    finalTerm: {
        type: Number,
        min: 0,
        max: 50,
        default: 0,
    },
}, {
    _id: false,
});
const enrolledCourseSchema = new mongoose_1.default.Schema({
    semesterRegistration: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'SemesterRegistration',
    },
    academicSemester: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicSemester',
    },
    academicFaculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicFaculty',
    },
    academicDepartment: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'AcademicDepartment',
    },
    offeredCourse: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'OfferedCourse',
    },
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Course',
    },
    student: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Student',
    },
    faculty: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: 'Faculty',
    },
    isEnrolled: {
        type: Boolean,
        default: false,
    },
    offeredCourseSection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'OfferedCourseSection',
    },
    courseMarks: {
        type: courseMarks,
        default: {},
    },
    grade: {
        type: String,
        enum: enrolledCourse_constant_1.Grade,
        default: 'NA',
    },
    gradePoints: {
        type: Number,
    },
    isCompleted: {
        type: Boolean,
        default: false,
    }
});
exports.EnrolledCourse = mongoose_1.default.model('EnrolledCourse', enrolledCourseSchema);
