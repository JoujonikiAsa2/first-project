/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose, { startSession } from 'mongoose';
import { Student } from './student.model';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import httpStatus from 'http-status';
import { TStudent } from './student.interface';
import { query } from 'express';
import QueryBuilder from '../../builder/QueryBuilder';
import { studentSearchableFields } from './student.constant';

const getAllStudentFromDB = async (query: Record<string, unknown>) => {
  // console.log('Base query:', query);
  // const queryObject = { ...query };
  // const studentSearchableFields = ['email', 'name.firstName', 'presentAddress'];
  // let searchTerm = '';
  // if (query?.searchTerm) {
  //   searchTerm = query?.searchTerm as string;
  // }

  // const searchQuery = Student.find({
  //   $or: studentSearchableFields.map((field) => {
  //     return {
  //       [field]: {
  //         $regex: searchTerm,
  //         $options: 'i',
  //       },
  //     };
  //   }),
  // });

  // //Filtering
  // const excludedFields = ['searchTerm', 'sort', 'limit', 'page', 'skip', 'fields'];
  // excludedFields.forEach((el) => delete queryObject[el]);
  // console.log('Query:', queryObject);

  // Final execution
  // const filterQuery = searchQuery
  //   .find(queryObject)
  //   .populate('admissionSemester')
  //   .populate({
  //     path: 'academicDepartment',
  //     populate: {
  //       path: 'academicFaculty',
  //     },
  //   });

  // let sort = '-createdAt';

  // if (query.sort) {
  //   sort = query.sort as string;
  // }
  // const sortQuery = filterQuery.sort(sort);

  // let page = 1
  // let limit = 1
  // let skip = 0

  // if (query.limit) {
  //   limit = Number(query.limit)
  // }

  // if(query.page){
  //   page = Number(query.page)
  //   skip = (page - 1) * limit
  // }
  // const paginateQuery =  sortQuery.limit(limit);
  // const limitQuery =  paginateQuery.skip(limit);

  // let fields = '-__v';
  // if (query.fields) {
  //   fields = (query.fields as string).split(',').join(' ');
  //   console.log(fields)
  // }
  // const fieldsQuery =  limitQuery.select(fields);
  // return fieldsQuery;

  const studentQuery = new QueryBuilder( //call the class
    Student.find()
      .populate('user')
      .populate('admissionSemester')
      .populate({
        path: 'academicDepartment',
        populate: {
          path: 'academicFaculty',
        },
      }),
    query,
  )
    .search(studentSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await studentQuery.modelQuery;
  return result;
};

// const getSingleStudentFromDB = async (id: string) => {
//   const result = await Student.aggregate([{$match: {id:id}}]);
//   return result;
// };
const getSingleStudentFromDB = async (id: string) => {
  const isStudentExist = await Student.isStudentExists(id);
  console.log(isStudentExist);
  if (!isStudentExist) {
    throw new AppError('Student not found', httpStatus.NOT_FOUND);
  }
  const result = await Student.findOne({ id: id })
    .populate('admissionSemester')
    .populate({
      path: 'academicDepartment',
      populate: {
        path: 'academicFaculty',
      },
    });
  return result;
};

const deleteStudentFromDB = async (id: string) => {
  //use static method
  const isStudentExist = await Student.isStudentExists(id);
  const isUserExist = await User.isUserExists(id);
  if ((!isStudentExist && !isUserExist) || !isUserExist) {
    throw new AppError('Student not found', httpStatus.NOT_FOUND);
  }
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const deletedStudent = await Student.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedStudent) {
      throw new AppError('Failed to delete student', httpStatus.BAD_REQUEST);
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete user', httpStatus.BAD_REQUEST);
    }

    await session.commitTransaction();
    await session.endSession();
    return deletedStudent;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError('Failed to delete student', httpStatus.BAD_REQUEST);
  }
};

const updateStudentIntoDB = async (id: string, payload: Partial<TStudent>) => {
  const { name, guardian, localGuardian, ...remainingStudentData } = payload;

  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingStudentData,
  };
  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  if (guardian && Object.keys(guardian).length > 0) {
    for (const [key, value] of Object.entries(guardian)) {
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  }

  if (localGuardian && Object.keys(localGuardian).length > 0) {
    for (const [key, value] of Object.entries(localGuardian)) {
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  }

  const result = await Student.findOneAndUpdate(
    { id: id },
    modifiedUpdatedData,
    {
      new: true,
      runValidators: true,
    },
  );

  return result;
};

export const StudentService = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
  updateStudentIntoDB,
};
