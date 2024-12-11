import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AcademicDepartmentServices } from "./academicDepartment.service";

const createAcademicDepartment = catchAsync(async(req,res)=>{
    const result = await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: 'Academic Department created successfully',
        data: result
    })
})


const getAcademicDepartment = catchAsync(async(req,res)=>{
    const result = await AcademicDepartmentServices.getAcademicDepartmentFromDB();
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Department retrieved successfully',
        data: result,
    })
})

const getSigngleAcademicDepartment = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const result = await AcademicDepartmentServices.getSingleAcademicDepartmentFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Department retrieved successfully',
        data: result,
    })
})

const updateAcademicDepartment = catchAsync(async(req,res)=>{
    const id = req.params.id;
    const result = await AcademicDepartmentServices.updateAcademicDepartmentIntoDB(id,req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,    
        success: true,
        message: 'Academic Department updated successfully',
        data: result,
    })
})

export const academicDepartmentControllers = {
    createAcademicDepartment,
    getAcademicDepartment,
    getSigngleAcademicDepartment,
    updateAcademicDepartment
}