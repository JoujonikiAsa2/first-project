import { UserServices } from './user.service';
import { sendResponse } from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';

//create student
const createStudent = catchAsync(async (req, res) => {

    const { password, student: studentData } = req.body;
    const result = await UserServices.createStudentIntoDB(password, studentData);
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Student created successfully',
      data: result,
    });
});

//get all students
const getAllStudent = catchAsync(async (req, res) => {
    const result = await UserServices.getUserFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Students retrieved successfully',
      data: result,
    });
})

export const userControllers = {
  createStudent,
  getAllStudent
};
