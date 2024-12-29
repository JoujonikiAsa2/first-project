import mongoose from 'mongoose';
import QueryBuilder from '../../builder/QueryBuilder';
import { CourseSearchableFields } from './course.constant';
import { TCourse, TCourseFaculty } from './course.interface';
import Course, { CourseFaculty } from './course.model';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

const createCourseIntoDB = async (payload: TCourse) => {
  const result = await Course.create(payload);
  return result;
};

const getAllCoursesFromDB = async (query: Record<string, unknown>) => {
  const courseQuery = new QueryBuilder(
    Course.find().populate('preRequisiteCourses.course'),
    query,
  )
    .search(CourseSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await courseQuery.modelQuery;
  return result;
};

const getSingleCourseFromDB = async (id: string) => {
  const existingCourse = await Course.isCourseExists(id);
  if (!existingCourse) {
    throw new AppError('Course does not exist', httpStatus.NOT_FOUND);
  }
  const result = await Course.findById(id).populate(
    'preRequisiteCourses.course',
  );
  return result;
};
const updateCourseIntoDB = async (id: string, payload: TCourse) => {
  const { preRequisiteCourses, ...courseRemainingData } = payload;
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const updateBasicCourseInfo = await Course.findByIdAndUpdate(
      id,
      courseRemainingData,
      {
        new: true,
        runValidators: true,
        session,
      },
    );
    if (!updateBasicCourseInfo) {
      throw new AppError('Failed to update course!', httpStatus.BAD_REQUEST);
    }

    //check if there is any preRequisiteCourses to update
    if (preRequisiteCourses && preRequisiteCourses.length > 0) {
      const deletedPreRequisites = preRequisiteCourses
        .filter((el) => el.course && el.isDeleted)
        .map((el) => el.course);
      const deletedPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $pull: {
            preRequisiteCourses: { course: { $in: deletedPreRequisites } },
          },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );
      if (!deletedPreRequisiteCourses) {
        throw new AppError('Failed to update course!', httpStatus.BAD_REQUEST);
      }
      // filter out the new course fields
      const newPreRequisites = preRequisiteCourses?.filter(
        (el) => el.course && !el.isDeleted,
      );

      const newPreRequisiteCourses = await Course.findByIdAndUpdate(
        id,
        {
          $addToSet: { preRequisiteCourses: { $each: newPreRequisites } },
        },
        {
          new: true,
          runValidators: true,
          session,
        },
      );

      if (!newPreRequisiteCourses) {
        throw new AppError('Failed to update course!', httpStatus.BAD_REQUEST);
      }
    }
    await session.commitTransaction();
    session.endSession();
    const result = await Course.findById(id).populate(
      'preRequisiteCourses.course',
    );

    return result;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};

const assignFacultiesWithCourseIntoDB = async (
  id: string,
  payload: Partial<TCourseFaculty>,
) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id,
    { $addToSet: {faculties: { $each: payload }} },
    { upsert: true, new: true },
  );
  return result;
};

const DeleteAssignedFacultiesWithCourseFromDB = async (id: string, payload: Partial<TCourseFaculty>) => {
  const result = await CourseFaculty.findByIdAndUpdate(
    id, {
      $pull: {faculties: { $in: payload }}
    },
    { new: true },
  );
  return result
}

const deleteCourseFromDB = async (id: string) => {
  const result = await Course.findByIdAndUpdate(
    id,
    { isDeleted: true },
    {
      new: true,
    },
  );
  return result;
};

export const courseServices = {
  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  DeleteAssignedFacultiesWithCourseFromDB
};
