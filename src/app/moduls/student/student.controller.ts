import { StudentService } from './student.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

const getSingleStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const result = await StudentService.getSingleStudentFromDB(studentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved succesfully',
    data: result,
  });
});

const getAllStudent = catchAsync(async (req, res) => {
    const result = await StudentService.getAllStudentFromDB();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Student are retrieved succesfully',
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

export const studentControllers = {
  getAllStudent,
  getSingleStudent,
  deleteStudent,
};
