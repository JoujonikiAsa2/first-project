import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import mongoose from 'mongoose';
import { User } from '../user/user.model';
import QueryBuilder from '../../builder/QueryBuilder';
import Admin from './admin.model';
import { TAdmin } from './admin.interface';
import { adminSearchableFields } from './admin.constant';

const getAllAdminIntoDB = async (query: Record<string, unknown>) => {
  const admin = Admin.find();
  const adminQuery = new QueryBuilder(admin, query)
    .search(adminSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await adminQuery.modelQuery;
  return result;
};
const getSingleAdminFromDB = async (id: string) => {
  const existingAdmin = await Admin.isAdminExists(id);
  if (!existingAdmin) {
    throw new AppError('Admin not found', httpStatus.NOT_FOUND);
  }
  const result = await Admin.findOne({ id: id });
  return result;
};
const updateSingleAdminIntoDB = async (
  id: string,
  payload: Partial<TAdmin>,
) => {
  const isExist = await Admin.isAdminExists(id);
  if (!isExist) {
    throw new AppError(
      'Unable to update, No admin found',
      httpStatus.BAD_REQUEST,
    );
  }
  //destructure the playload
  const { name, ...remainingAdminData } = payload;

  //create a empty object
  const modifiedUpdatedData: Record<string, unknown> = {
    ...remainingAdminData,
  };

  //check if name is not empty
  if (name && Object.keys(name).length > 0) {
    for (const [key, value] of Object.entries(name)) {
      modifiedUpdatedData[`name.${key}`] = value;
    }
  }

  const result = await Admin.findOneAndUpdate({ id: id }, modifiedUpdatedData, {
    new: true,
    runValidators: true,
  });
  return result;
};
const deleteSingleAdminFromDB = async (id: string) => {
  const existingAdmin = await Admin.isAdminExists(id);
  const isUserExist = await User.isUserExists(id);
  if ((!existingAdmin && !isUserExist) || !isUserExist) {
    throw new AppError('Admin not found', httpStatus.NOT_FOUND);
  }
  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    const deletedAdmin = await Admin.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedAdmin) {
      throw new AppError('Failed to delete admin', httpStatus.BAD_REQUEST);
    }

    const deletedUser = await User.findOneAndUpdate(
      { id: id },
      { isDeleted: true },
      { new: true, session },
    );

    if (!deletedUser) {
      throw new AppError('Failed to delete admin', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedAdmin;
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw error;
  }
};

export const adminServices = {
  getAllAdminIntoDB,
  getSingleAdminFromDB,
  updateSingleAdminIntoDB,
  deleteSingleAdminFromDB,
};
