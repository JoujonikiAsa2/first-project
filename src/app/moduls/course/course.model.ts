import { model, Schema } from 'mongoose';
import {
  CourseModel,
  TCourse,
  TCourseFaculty,
  TPreRequisite,
} from './course.interface';

const preRequisiteSchema = new Schema<TPreRequisite>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    _id: false,
  },
);
const courseShema = new Schema<TCourse>({
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

courseShema.statics.isCourseExists = async function (id: string) {
  const existingCourse = await Course.findOne({ _id: id, isDeleted: false });
  return existingCourse;
};

const Course = model<TCourse, CourseModel>('Course', courseShema);
export default Course;

export const courseFacultySchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    unique: true,
  },
  faculties: {
    type: [Schema.Types.ObjectId],
    ref: 'Faculty',
  },
});

export const CourseFaculty = model<TCourseFaculty>(
  'CourseFaculty',
  courseFacultySchema,
);
