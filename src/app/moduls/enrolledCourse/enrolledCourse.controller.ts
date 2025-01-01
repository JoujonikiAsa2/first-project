import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { enrolledCourseServices } from './enrolledCourse.service';

const createEnrolledCourse = catchAsync(async (req, res) => {
  const result = await enrolledCourseServices.createEnrolledCourseIntoDB(
    req?.user?.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Enrolled Course created successfully',
    data: result,
  });
});

const updateCourseMarks = catchAsync(async (req, res) => {
  const result = await enrolledCourseServices.updateCourseMarksIntoDB(
    req?.user?.userId,
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Course marks updatedsuccessfully',
    data: result,
  });
});

const getMyEnrolledCourses = catchAsync(async (req, res) => {
  const studentId = req?.user?.userId;
  const query = req.query;
  const result = await enrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId, query,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My enrolled courses retrieved successfully',
    meta: result.meta,
    data: result.result,
  });
});

const getSingleEnrolledCourse = catchAsync(async (req, res) => {
  const studentId = req?.user?.userId;
  const query = req.query;
  const result = await enrolledCourseServices.getMyEnrolledCoursesFromDB(
    studentId, query,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'My enrolled course retrieved successfully',
    data: result,
  });
});

export const enrolledCourseControllers = {
  createEnrolledCourse,
  updateCourseMarks,
  getMyEnrolledCourses,
  getSingleEnrolledCourse
};
