import { UserServices } from './user.service';
import { sendResponse } from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';

//create student
const createStudent = catchAsync(async (req, res) => {
  const { password, student: studentData } = req.body;
  const result = await UserServices.createStudentIntoDB(req?.file, password, studentData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

//create faculty
const createFaculty = catchAsync(async (req, res) => {
  const { password, faculty: facultyData } = req.body;
  const result = await UserServices.createFacultyIntoDB(req.file, password, facultyData);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty created successfully',
    data: result,
  });
});

//create admin
const createAdmin = catchAsync(async (req, res) => {
  const { password, admin } = req.body;
  const result = await UserServices.createAdminIntoDB(req.file, password, admin);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Admin created successfully!',
    data: result,
  });
});

//get all students
const getAllStudent = catchAsync(async (req, res) => {
  const result = await UserServices.getAllUsersFromDB(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getMe = catchAsync(async (req, res) => {
  const user = req.user;
  if (!user) {
    throw new AppError('Token not found', httpStatus.NOT_FOUND);
  }

  const { userId, role } = user;
  const result = await UserServices.getMe(userId, role);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

const changeStatus = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await UserServices.changeStatus(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Status changed successfully',
    data: result,
  });
});

export const userControllers = {
  createStudent,
  getAllStudent,
  createFaculty,
  createAdmin,
  getMe,
  changeStatus,
};
