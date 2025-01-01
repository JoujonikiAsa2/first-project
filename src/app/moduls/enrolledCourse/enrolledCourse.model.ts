import mongoose, { Schema } from 'mongoose';
import { Grade } from './enrolledCourse.constant';

const courseMarks = new mongoose.Schema(
  {
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
  },
  {
    _id: false,
  },
);

const enrolledCourseSchema = new mongoose.Schema({
  semesterRegistration: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'SemesterRegistration',
  },
  academicSemester: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicSemester',
  },
  academicFaculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicFaculty',
  },
  academicDepartment: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'AcademicDepartment',
  },
  offeredCourse: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'OfferedCourse',
  },
  course: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Course',
  },
  student: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Student',
  },
  faculty: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Faculty',
  },
  isEnrolled: {
    type: Boolean,
    default: false,
  },
  offeredCourseSection: {
    type: Schema.Types.ObjectId,
    ref: 'OfferedCourseSection',
  },
  courseMarks: {
    type: courseMarks,
    default: {},
  },
  grade: {
    type: String,
    enum: Grade,
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

export const EnrolledCourse = mongoose.model(
  'EnrolledCourse',
  enrolledCourseSchema,
);
