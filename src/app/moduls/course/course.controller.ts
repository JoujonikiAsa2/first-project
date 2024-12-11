import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { courseServices } from "./course.service";

const createCourse = catchAsync(async (req, res) => {
    const result = await courseServices.createCourseIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course created successfully',
        data: result,
    });
}); 
const getAllCourses = catchAsync(async (req, res) => {
    const query = req.query
    const result = await courseServices.getAllCoursesFromDB(query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Courses retrieved successfully',
        data: result,
    });
});

const getSingleCourse = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await courseServices.getSingleCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course retrieved successfully',
        data: result,
    });
});

const assignFaculties = catchAsync(async (req, res) => {
    const {courseId} = req.params;
    const {faculties} = req.body;
    const result = await courseServices.assignFacultiesWithCourseIntoDB(courseId, faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course faculties created successfully',
        data: result,
    });
});

const deleteAssignedFaculty = catchAsync(async (req, res) => {
    const {courseId} = req.params;
    const {faculties} = req.body;
    const result = await courseServices.DeleteAssignedFacultiesWithCourseFromDB(courseId, faculties);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Removed faculties from course successfully',
        data: result,
    });
});

const updateSingleCourse = catchAsync(async (req, res) => {
    const {id} = req.params;
    const payload = req.body;
    const result = await courseServices.updateCourseIntoDB(id, payload);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course updated successfully',
        data: result,
    });
});

const deleteSingleCourse = catchAsync(async (req, res) => {
    const id = req.params.id;
    const result = await courseServices.deleteCourseFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Course deleted successfully',
        data: result,
    });
});

export const courseController = {
    createCourse,
    getAllCourses,
    getSingleCourse,
    updateSingleCourse,
    deleteSingleCourse,
    assignFaculties,
    deleteAssignedFaculty
}
