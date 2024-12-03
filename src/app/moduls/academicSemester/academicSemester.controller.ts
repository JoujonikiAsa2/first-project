import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AcademicServices } from './academicSemester.service';

const createAcademicSemester = catchAsync(async (req, res) => {
  const result = await AcademicServices.createAcademicSemesterIntoDB(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semester created successfully',
    data: result,
  });
});

const getAcademicSemesters = catchAsync(async (req, res) => {
  const result = await AcademicServices.getAcademicSemestersFromDB();
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semesters retrieved successfully',
    data: result,
  });
});

const getAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const result = await AcademicServices.getAcademicSemesterFromDB(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semesters retrieved successfully',
    data: result,
  });
});

const updateAcademicSemester = catchAsync(async (req, res) => {
  const id = req.params.id;
  const academicSemesterDetails = req.body
  const result = await AcademicServices.updateAcademicSemesterIntoDB(id,academicSemesterDetails);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Academic Semesters updated successfully',
    data: result,
  });
});

export const academicSemesterControllers = {
  createAcademicSemester,
  getAcademicSemesters,
  getAcademicSemester,
  updateAcademicSemester
};
