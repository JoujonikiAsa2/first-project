import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { SemesterRegistrationServices } from './semesterRegistration.service';

const createSemesterRegistration = catchAsync(async (req, res) => {
  const semesterRegistration = req.body;
  const result = await
    SemesterRegistrationServices.createSemesterRegistrationIntoDB(
      semesterRegistration,
    );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Student is retrieved succesfully',
    data: result,
  });
});
const getAllSemesterRegistration = catchAsync(async (req, res) => {
    const query = req.query
    const result = await SemesterRegistrationServices.getAllSemesterRegistrationFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semesters registration retrieved successfully',
        data: result,
    })
});
const getSingleSemesterRegistration = catchAsync(async (req, res) => {
    const {id} = req.params
    const result = await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Semester registration retrieved successfully',
        data: result,
    })
});
const updateSemesterRegistration = catchAsync(async (req, res) => {
  const {id} = req.params
  const registration = req.body
  const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(id, registration);
  sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester registration updated successfully',
      data: result,
  })
});


const deleteSemesterRegistration = catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const result =
      await SemesterRegistrationServices.deleteSemesterRegistrationFromDB(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Semester Registration is updated successfully',
      data: result,
    });
  },
);

export const semesterRegistrationController = {
  createSemesterRegistration,
  getAllSemesterRegistration,
  getSingleSemesterRegistration,
  updateSemesterRegistration,
  deleteSemesterRegistration
};
