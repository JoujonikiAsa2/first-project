import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { OfferedCourseServices } from './offeredCourse.service.ts';

const createOfferedCourse = catchAsync(async (req, res) => {
  const OfferedCourse = req.body;
  // console.log(OfferedCourse)
  const result =
    await OfferedCourseServices.createOfferedCourseIntoDB(OfferedCourse);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Course is created succesfully',
    data: result,
  });
});
const getAllOfferedCourse = catchAsync(async (req, res) => {
  const query = req.query;
  const result = await OfferedCourseServices.getAllOfferedCourseFromDB(query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});
const getMyOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(
    req?.user?.userId,
    req.query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered Courses retrieved successfully',
    data: result,
  });
  console.log('getMyOfferedCourses');
});
const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course retrieved successfully',
    data: result,
  });
});
const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    payload,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Offered course updated successfully',
    data: result,
  });
});

const deleteOfferedCourseFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.deleteOfferedCourseFromDB(id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OfferedCourse deleted successfully',
    data: result,
  });
});

export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourse,
  getMyOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  deleteOfferedCourseFromDB,
};
