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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseFaculty = exports.courseFacultySchema = void 0;
const mongoose_1 = require("mongoose");
const preRequisiteSchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, {
    _id: false,
});
const courseShema = new mongoose_1.Schema({
    prefix: {
        type: String,
        required: true,
        trim: true,
    },
    code: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    credit: {
        type: Number,
        required: true,
    },
    preRequisiteCourses: [preRequisiteSchema],
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
courseShema.statics.isCourseExists = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const existingCourse = yield Course.findOne({ _id: id, isDeleted: false });
        return existingCourse;
    });
};
const Course = (0, mongoose_1.model)('Course', courseShema);
exports.default = Course;
exports.courseFacultySchema = new mongoose_1.Schema({
    course: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Course',
        unique: true,
    },
    faculties: {
        type: [mongoose_1.Schema.Types.ObjectId],
        ref: 'Faculty',
    },
});
exports.CourseFaculty = (0, mongoose_1.model)('CourseFaculty', exports.courseFacultySchema);
