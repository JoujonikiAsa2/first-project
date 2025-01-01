/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import { TEnrolledCourse } from './enrolledCourse.interface';
import { Student } from '../student/student.model';
import { EnrolledCourse } from './enrolledCourse.model';
import mongoose from 'mongoose';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import Course from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { calculateGradeAndPoints } from './enrolledCourse.utils';
import QueryBuilder from '../../builder/QueryBuilder';

const createEnrolledCourseIntoDB = async (
  userId: string,
  payload: TEnrolledCourse,
) => {
  const { offeredCourse } = payload;

  //check if the offered course exists
  const isOfferedCourseExists = await OfferedCourse.findById(
    payload.offeredCourse,
  );

  if (!isOfferedCourseExists) {
    throw new AppError('Offered course does not exist', httpStatus.NOT_FOUND);
  }

  const {
    semesterRegistration,
    academicSemester,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
  } = isOfferedCourseExists;

  //if max capacity exceeded
  if (isOfferedCourseExists.maxCapacity <= 0) {
    throw new AppError(
      'Enrolled students capacity exceeded',
      httpStatus.BAD_GATEWAY,
    );
  }

  //check if the student exists
  const student = await Student.findOne({ id: userId });
  if (!student) {
    throw new AppError('Student does not exist', httpStatus.NOT_FOUND);
  }

  //check if the student already enrolled
  const isStudentAlreadyEnrolled = await EnrolledCourse.findOne({
    semesterRegistration: isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student: student?._id,
  });

  if (isStudentAlreadyEnrolled) {
    throw new AppError('Student already enrolled', httpStatus.CONFLICT);
  }

  //current course credit
  // check total credits exceeds maxCredit
  const currentCourse = await Course.findById(isOfferedCourseExists.course);
  const currentCredit = currentCourse?.credit;

  const offeredCourseSemesterRegistration = await SemesterRegistration.findById(
    isOfferedCourseExists.semesterRegistration,
  ).select('maxCredit');

  const maxCredit = offeredCourseSemesterRegistration?.maxCredit;

  const enrolledCourses = await EnrolledCourse.aggregate([
    {
      $match: {
        semesterRegistration: semesterRegistration,
        student: student?._id,
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

  const totalCredits =
    enrolledCourses.length > 0 ? enrolledCourses[0].totalEnrolledCredits : 0;

  if (totalCredits && maxCredit && totalCredits + currentCredit > maxCredit) {
    throw new AppError(
      'Total enrolled credits exceeds maxCredit',
      httpStatus.BAD_REQUEST,
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const result = await EnrolledCourse.create(
      [
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
      ],
      { session },
    );

    if (!result) {
      throw new AppError(
        'Failed to enroll in this cousre !',
        httpStatus.BAD_REQUEST,
      );
    }

    const maxCapacity = isOfferedCourseExists.maxCapacity;
    await OfferedCourse.findByIdAndUpdate(offeredCourse, {
      maxCapacity: maxCapacity - 1,
    });

    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};
const getSignlenrolledCourseFromDB = async () => {};
const getMyEnrolledCoursesFromDB = async (
  studentId: string,
  query: Record<string, unknown>,
) => {
  const student = await Student.findOne({ id: studentId });

  if (!student) {
    throw new AppError('Student not found !',httpStatus.NOT_FOUND, );
  }

  const enrolledCourseQuery = new QueryBuilder(
    EnrolledCourse.find({ student: student._id }).populate(
      'semesterRegistration academicSemester academicFaculty academicDepartment offeredCourse course student faculty',
    ),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await enrolledCourseQuery.modelQuery;
  const meta = await enrolledCourseQuery.count();

  return {
    meta,
    result,
  };
};
const updateCourseMarksIntoDB = async (
  facultyId: string,
  payload: Partial<TEnrolledCourse>,
) => {
  const { semesterRegistration, offeredCourse, student, courseMarks } = payload;

  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'Semester registration not found !',
      httpStatus.NOT_FOUND,
    );
  }

  const isOfferedCourseExists = await OfferedCourse.findById(offeredCourse);

  if (!isOfferedCourseExists) {
    throw new AppError('Offered course not found !', httpStatus.NOT_FOUND);
  }
  const isStudentExists = await Student.findById(student);

  if (!isStudentExists) {
    throw new AppError('Student not found !', httpStatus.NOT_FOUND);
  }

  const faculty = await Faculty.findOne({ id: facultyId }, { _id: 1 });

  if (!faculty) {
    throw new AppError('Faculty not found !', httpStatus.NOT_FOUND);
  }

  const isCourseBelongToFaculty = await EnrolledCourse.findOne({
    semesterRegistration,
    offeredCourse,
    student,
    faculty: faculty._id,
  });

  if (!isCourseBelongToFaculty) {
    throw new AppError('You are forbidden! !', httpStatus.FORBIDDEN);
  }

  const modifiedData: Record<string, unknown> = {
    ...courseMarks,
  };

  if (courseMarks?.finalTerm) {
    const { classTest1, classTest2, midTerm, finalTerm } =
      isCourseBelongToFaculty.courseMarks;

    const totalMarks =
      Math.ceil(classTest1 * 0.1) +
      Math.ceil(midTerm * 0.3) +
      Math.ceil(classTest2 * 0.1) +
      Math.ceil(finalTerm * 0.5);

    const result = calculateGradeAndPoints(totalMarks);

    modifiedData.grade = result.grade;
    modifiedData.gradePoints = result.gradePoints;
    modifiedData.isCompleted = true;
  }

  if (courseMarks && Object.keys(courseMarks).length) {
    for (const [key, value] of Object.entries(courseMarks)) {
      modifiedData[`courseMarks.${key}`] = value;
    }
  }

  const result = await EnrolledCourse.findByIdAndUpdate(
    isCourseBelongToFaculty._id,
    modifiedData,
    {
      new: true,
    },
  );

  return result;
};

export const enrolledCourseServices = {
  createEnrolledCourseIntoDB,
  getSignlenrolledCourseFromDB,
  getMyEnrolledCoursesFromDB,
  updateCourseMarksIntoDB,
};
