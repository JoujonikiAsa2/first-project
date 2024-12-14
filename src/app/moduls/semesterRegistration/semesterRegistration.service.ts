/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TSemesterRegistration } from './semesterRegistration.interface';
import { SemesterRegistration } from './semesterRegistration.model';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { RegistrationStatus } from './semesterRegistration.constant';
import { OfferedCourse } from '../offeredCourse/offeredCourse.model';
import mongoose from 'mongoose';

const createSemesterRegistrationIntoDB = async (
  payload: TSemesterRegistration,
) => {
  const academicSemester = payload?.academicSemester;

  //check if there any registered semester that is already UPCOMING | ONGOING
  const isThereAnyUpcomingOrOngoingSEmester =
    await SemesterRegistration.findOne({
      $or: [{ status: RegistrationStatus.UPCOMING }, { status: RegistrationStatus.ONGOING }],
    });

  if (isThereAnyUpcomingOrOngoingSEmester) {
    throw new AppError(
      `There is aready an ${isThereAnyUpcomingOrOngoingSEmester.status} registered semester !`,
      httpStatus.BAD_REQUEST,
    );
  }
  // check if the semester is exist
  const isAcademicSemesterExists =
    await AcademicSemester.findById(academicSemester);

  if (!isAcademicSemesterExists) {
    throw new AppError(
      'This academic semester not found !',
      httpStatus.NOT_FOUND,
    );
  }

  // check if the semester is already registered!
  const isSemesterRegistrationExists = await SemesterRegistration.findOne({
    academicSemester,
  });

  if (isSemesterRegistrationExists) {
    throw new AppError(
      'This semester is already registered!',
      httpStatus.CONFLICT,
    );
  }

  const result = await SemesterRegistration.create(payload);
  return result;
};
const getAllSemesterRegistrationFromDB = async (
  query: Record<string, unknown>,
) => {
  const semesterRegistrationQuery = new QueryBuilder(
    SemesterRegistration.find().populate('academicSemester'),
    query,
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};
const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result =
    await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};
const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  const requestedStatus = payload.status;
  // if the semester registration is exists
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'Semester registration not found !',
      httpStatus.NOT_FOUND,
    );
  }
  //  if the requested semester registration is ended we will not update anything
  const currentSemesterStatus = isSemesterRegistrationExists?.status;

  if (currentSemesterStatus === RegistrationStatus.ENDED) {
    throw new AppError(
      'You cannot update an ended semester registration',
      httpStatus.BAD_REQUEST,
    );
  }

  // UPCOMING ---> ONGOING ---> ENDED
  if(currentSemesterStatus === RegistrationStatus.UPCOMING && requestedStatus === RegistrationStatus.ENDED){
    throw new AppError(
      `You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}!`,
      httpStatus.BAD_REQUEST,
    )
  }
  if(currentSemesterStatus === RegistrationStatus.ONGOING && requestedStatus === RegistrationStatus.UPCOMING){
    throw new AppError(
      `You cannot directly change status from ${currentSemesterStatus} to ${requestedStatus}!`,
      httpStatus.BAD_REQUEST,
    )
  }
  const result = await SemesterRegistration.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  return result;
};

const deleteSemesterRegistrationFromDB = async (id: string) => {
  /** 
  * Step1: Delete associated offered courses.
  * Step2: Delete semester registraton when the status is 
  'UPCOMING'.
  **/

  // checking if the semester registration is exist
  const isSemesterRegistrationExists = await SemesterRegistration.findById(id);

  if (!isSemesterRegistrationExists) {
    throw new AppError(
      'This registered semester is not found !',
      httpStatus.NOT_FOUND
    );
  }

  // checking if the status is still "UPCOMING"
  const semesterRegistrationStatus = isSemesterRegistrationExists.status;

  if (semesterRegistrationStatus !== 'UPCOMING') {
    throw new AppError(
      `You can not update as the registered semester is ${semesterRegistrationStatus}`,
        httpStatus.BAD_REQUEST
    );
  }

  const session = await mongoose.startSession();

  //deleting associated offered courses

  try {
    session.startTransaction();

    const deletedOfferedCourse = await OfferedCourse.deleteMany(
      {
        semesterRegistration: id,
      },
      {
        session,
      },
    );

    if (!deletedOfferedCourse) {
      throw new AppError(
        'Failed to delete semester registration !',
        httpStatus.BAD_REQUEST
      );
    }

    const deletedSemisterRegistration =
      await SemesterRegistration.findByIdAndDelete(id, {
        session,
        new: true,
      });

    if (!deletedSemisterRegistration) {
      throw new AppError(
        'Failed to delete semester registration !',
        httpStatus.BAD_REQUEST
      );
    }

    await session.commitTransaction();
    await session.endSession();

    return null;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const SemesterRegistrationServices = {
  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB,
  deleteSemesterRegistrationFromDB
};
