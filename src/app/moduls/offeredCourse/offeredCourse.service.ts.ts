import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import { SemesterRegistration } from '../semesterRegistration/semesterRegistration.model';
import { TOfferedCourse } from './offeredCourse.interface';
import { OfferedCourse } from './offeredCourse.model';
import AppError from '../../errors/AppError';
import AcademicFaculty from '../academicFaculty/academicFaculty.model';
import AcademicDepartment from '../academicDepartment/academicDepartment.model';
import Course from '../course/course.model';
import Faculty from '../faculty/faculty.model';
import { hasTimeConflict } from './offeredCourse.utils';
import { RegistrationStatus } from '../semesterRegistration/semesterRegistration.constant';

const createOfferedCourseIntoDB = async (payload: TOfferedCourse) => {
  const {
    semesterRegistration,
    academicFaculty,
    academicDepartment,
    course,
    faculty,
    section,
    days,
    startTime,
    endTime,
  } = payload;
  console.log(payload);

  /**
   * Step 9: check if the faculty is available at that time. If not then throw error
   * Step 10: create the offered course
   */
  //   * Step 1: check if the semester registration id is exists!
  const isSemesterRegistrationExists =
    await SemesterRegistration.findById(semesterRegistration);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'Semester Registration does not exists',
      httpStatus.NOT_FOUND,
    );
  }

  console.log('pass step 1', payload);

  const academicSemester = isSemesterRegistrationExists.academicSemester;

  //   * Step 2: check if the academic faculty id is exists!
  const isAcademicFacultyExists =
    await AcademicFaculty.findById(academicFaculty);

  if (!isAcademicFacultyExists) {
    throw new AppError(
      'Academic faculty does not exists',
      httpStatus.NOT_FOUND,
    );
  }
  console.log('pass step 2', payload);
  //   * Step 3: check if the academic department id is exists!
  const isAcademicDepartmentExists =
    await AcademicDepartment.findById(academicDepartment);

  if (!isAcademicDepartmentExists) {
    throw new AppError(
      'Academic department does not exists',
      httpStatus.NOT_FOUND,
    );
  }
  console.log('pass step 3', payload);

  //   * Step 4: check if the course id is exists!
  const isCourseExists = await Course.findById(course);

  if (!isCourseExists) {
    throw new AppError('Course does not exists', httpStatus.NOT_FOUND);
  }
  console.log('pass step 4', payload);

  //   * Step 5: check if the faculty id is exists!
  const isFacultyExists = await Faculty.findById(faculty);

  if (!isFacultyExists) {
    throw new AppError('Faculty does not exists', httpStatus.NOT_FOUND);
  }
  console.log('pass step 5', payload);

  const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
    _id: academicDepartment,
    academicFaculty,
  });

  if (!isDepartmentBelongToFaculty) {
    throw new AppError(
      `This ${isAcademicDepartmentExists.name} is not  belong to this ${isAcademicDepartmentExists.name}`,
      httpStatus.BAD_REQUEST,
    );
  }

  //   * Step 7: check if the same offered course same section in same registered semester exists
  const isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection =
    await OfferedCourse.findOne({
      semesterRegistration,
      course,
      section,
    });

  if (isSameOfferedCourseExistsWithSameRegisteredSemesterWithSameSection) {
    throw new AppError(
      `Offered course with same section is already exist!`,
      httpStatus.BAD_REQUEST,
    );
  }

  //   * Step 8: get the schedules of the faculties

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  console.log(assignedSchedules);
  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      `Faculty is not available at this time!`,
      httpStatus.BAD_REQUEST,
    );
  }

  const result = await OfferedCourse.create({ ...payload, academicSemester });
  return result;
};
const getAllOfferedCourseFromDB = async (query: Record<string, unknown>) => {
  const OfferedCourseQuery = new QueryBuilder(
    OfferedCourse.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await OfferedCourseQuery.modelQuery;
  return result;
};
const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate('academicSemester');
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse, 'faculty' | 'days' | 'startTime' | 'endTime'>,
) => {
  const { faculty, days, startTime, endTime } = payload;

  //check if the offered course is exist
  const offeredCourse = await OfferedCourse.findById(id);
  if (!offeredCourse) {
    throw new AppError('Offered course not found', httpStatus.NOT_FOUND);
  }

  //check if the faculty is exist
  const isFacultyExist = await Faculty.findById(faculty);
  if (!isFacultyExist) {
    throw new AppError('Faculty not found', httpStatus.NOT_FOUND);
  }

  //check if the semesterRegistration is exist
  const semesterRegistrationExists = await SemesterRegistration.findById(
    offeredCourse.semesterRegistration,
  );
  if (
    semesterRegistrationExists?.status !== RegistrationStatus.UPCOMING 
  ) {
    throw new AppError(
      `${semesterRegistrationExists?.status} status can not be updated`,
      httpStatus.NOT_FOUND,
    );
  }

  const assignedSchedules = await OfferedCourse.find({
    semesterRegistration: offeredCourse.semesterRegistration,
    faculty,
    days: { $in: days },
  }).select('days startTime endTime');

  const newSchedule = {
    days,
    startTime,
    endTime,
  };

  if (hasTimeConflict(assignedSchedules, newSchedule)) {
    throw new AppError(
      `Faculty is not available at this time!`,
      httpStatus.BAD_REQUEST,
    );
  }
  const result = await OfferedCourse.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return result;
};

const deleteOfferedCourseFromDB = async (id: string) => {
    /**
     * Step 1: check if the offered course exists
     * Step 2: check if the semester registration status is upcoming
     * Step 3: delete the offered course
     */
    const isOfferedCourseExists = await OfferedCourse.findById(id);
  
    if (!isOfferedCourseExists) {
      throw new AppError( 'Offered Course not found',httpStatus.NOT_FOUND,);
    }
  
    const semesterRegistation = isOfferedCourseExists.semesterRegistration;
  
    const semesterRegistrationStatus =
      await SemesterRegistration.findById(semesterRegistation).select('status');
  
    if (semesterRegistrationStatus?.status !== 'UPCOMING') {
      throw new AppError(
        `Offered course can not update ! because the semester ${semesterRegistrationStatus}`,
        httpStatus.BAD_REQUEST
      );
    }
  
    const result = await OfferedCourse.findByIdAndDelete(id);
  
    return result;
  };

export const OfferedCourseServices = {
  createOfferedCourseIntoDB,
  getAllOfferedCourseFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB,
  deleteOfferedCourseFromDB
};
