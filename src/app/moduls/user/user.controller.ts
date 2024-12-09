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
      message: 'User created successfully',
      data: result,
    });
});

//create faculty
const createFaculty = catchAsync(async(req, res)=>{
  const {password, faculty: facultyData} = req.body
  const result = await UserServices.createFacultyIntoDB(password, facultyData)
  // console.log(result)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Faculty created successfully',
    data: result
  })
})

//create admin
const createAdmin = catchAsync(async(req, res)=>{
  const {password, admin} = req.body
  const result = await UserServices.createAdminIntoDB(password, admin)
  sendResponse(res,{
    statusCode: 200,
    success: true,
    message: 'Admin created successfully!',
    data: result
  })
})

//get all students
const getAllStudent = catchAsync(async (req, res) => {
    const result = await UserServices.getUserFromDB();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
})

export const userControllers = {
  createStudent,
  getAllStudent,
  createFaculty,
  createAdmin
};
