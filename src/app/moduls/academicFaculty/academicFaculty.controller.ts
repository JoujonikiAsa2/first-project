import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { academicFacultyServices } from "./academicFaculty.service";

const createAcademicFaculty = catchAsync(async(req,res)=>{
    const result = await academicFacultyServices.createAcademicFacultyIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Faculty created successfully',
        data: result,
    })
})

const getAcademicFaculty = catchAsync(async(req,res)=>{
    const result = await academicFacultyServices.getAcademicFacultyFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Faculty retrieved successfully',
        data: result,
    })
})

const getSigngleAcademicFaculty = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const result = await academicFacultyServices.getSingleAcademicFacultyFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Faculty retrieved successfully',
        data: result,
    })
})

const updateAcademicFaculty = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const result = await academicFacultyServices.updateAcademicFacultyIntoDB(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Faculty updated successfully',
        data: result,
    })
})

export const academicFacultyControllers = {
    createAcademicFaculty,
    getAcademicFaculty,
    getSigngleAcademicFaculty,
    updateAcademicFaculty
}