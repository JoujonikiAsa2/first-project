import { StudentService } from './student.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getSingleStudent = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await StudentService.getSingleStudentFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student is retrieved succesfully',
    data: result,
  });
});

const getAllStudent = catchAsync(async (req, res) => {
  console.log(req.query)
  const result = await StudentService.getAllStudentFromDB(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Students are retrieved succesfully',
    data: result,
  });
});

const deleteStudent = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await StudentService.deleteStudentFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student deleted successfully',
    data: result,
  });
});

const updateStudent = catchAsync(async (req, res) => {
  const {id} = req.params;
  const { student } = req.body;
  const result = await StudentService.updateStudentIntoDB(id, student);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Student updated successfully',
    data: result,
  });
});

export const studentControllers = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
  updateStudent,
};
