import mongoose from 'mongoose';
import config from '../../config';
import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { AcademicSemester } from './../academicSemester/academicSemester.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import { generateStudentId } from './user.utils';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { TFaculty } from '../faculty/faculty.interface';
import Faculty from '../faculty/faculty.model';
import { TAdmin } from '../admin/admin.interface';
import Admin from '../admin/admin.model';
import { generateFacultyId } from '../faculty/faculty.util';
import { generateAdminId } from '../admin/admin.util';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};
  // console.log("Payloads:", payload)

  //if password is not given , use deafult password
  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'student';

  // find academic semester info
  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  //create a isolated environment
  const session = await mongoose.startSession();

  //use transaction
  try {
    //start the session
    session.startTransaction();
    //set  generated id
    userData.id = await generateStudentId(
      admissionSemester as TAcademicSemester,
    );

    // console.log("User Data:", userData)
    // create a user
    const newUser = await User.create([userData], { session });

    //create a student
    if (!newUser.length) {
      throw new AppError('Failed to create user', httpStatus.BAD_REQUEST);
    }

    // set id , _id as user
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id; //reference _id

    const newStudent = await Student.create([payload], { session });

    if (!newStudent.length) {
      throw new AppError('Failed to create student', httpStatus.BAD_REQUEST);
    }

    //commit the transaction
    await session.commitTransaction();
    //end the session
    session.endSession();
    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const createFacultyIntoDB = async (
  password: string,
  payload: Partial<TFaculty>,
) => {
  // console.log('Payloads:', payload);
  // create a user object
  const userData: Partial<TUser> = {};

  userData.password = password || (config.default_pass as string);

  //set student role
  userData.role = 'faculty';

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    //set generated id
    userData.id = await generateFacultyId();

    const newUser = await User.create([userData], { session });
    // console.log('User Created:', newUser);
    if (!newUser.length) {
      throw new AppError('Failed to create user', httpStatus.BAD_REQUEST);
    }

    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    const newFaculty = await Faculty.create([payload], { session });
    if (!newFaculty.length) {
      throw new AppError('Failed to create student', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    //end the session
    session.endSession();
    return newFaculty;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  //create a empty user data
  const userData: Partial<TUser> = {};
  userData.password = password || (config.default_pass as string);
  userData.role = 'admin';

  const session = await mongoose.startSession();
  try {
    await session.startTransaction();
    userData.id = await generateAdminId();

    const newUser = await User.create([userData], { session });
    // console.log('User',newUser)
    if (!newUser) {
      throw new AppError('Failed to creare user', httpStatus.BAD_REQUEST);
    }
    
    // console.log('Admin',payload)
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;
    const newAdmin = await Admin.create([payload], { session });
    if (!newAdmin) {
      throw new AppError('Failed to creare admin', httpStatus.BAD_REQUEST);
    }
    await session.commitTransaction();
    session.endSession();
    return newAdmin;
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};

const getUserFromDB = async () => {
  const result = await User.find();
  return result;
};

export const UserServices = {
  createStudentIntoDB,
  getUserFromDB,
  createFacultyIntoDB,
  createAdminIntoDB
};
