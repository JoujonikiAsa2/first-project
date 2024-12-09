import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { TFaculty } from './faculty.interface';
import Faculty from './faculty.model';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import { facultySearchableFields } from './fauclty.constant';

const getFacultyIntoDB = async (query: Record<string, unknown>) => {
  const faculty =  Faculty.find();
  const facultyQuery = new QueryBuilder(
    faculty, query
  ).search(facultySearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields()
  ;
  const result = await facultyQuery.modelQuery
  return result;
};
const getSignleFacultyFromDB = async (id: string) => {
  const existingFaculty = await Faculty.isFacultyExists(id);
  if (!existingFaculty) { 
    throw new AppError('Faculty not found', httpStatus.NOT_FOUND);
  }
  const result = await Faculty.findOne({ id: id });
  return result;
};
const updateSingleFacultyIntoDB = async (
  id: string,
  payload: Partial<TFaculty>,
) => {
  const { name, ...remainingFacultyData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingFacultyData,
  };
  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  console.log(name);
  const result = await Faculty.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );
  console.log(result);
  return result;
};
const deleteSingleFacultyFromDB = async (id: string) => {
  const existingFaculty = await Faculty.isFacultyExists(id);
  const isUserExist = await User.isUserExists(id);
  if (!existingFaculty && !isUserExist || !isUserExist) {
    throw new AppError('Faculty not found', httpStatus.NOT_FOUND);
  }
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const deletedFaculty = await Faculty.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true,session },
    );

    if (!deletedFaculty) {
      throw new AppError('Failed to delete faculty', httpStatus.BAD_REQUEST);
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete faculty', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedFaculty;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const facultyServices = {
  getFacultyIntoDB,
  getSignleFacultyFromDB,
  updateSingleFacultyIntoDB,
  deleteSingleFacultyFromDB,
};
