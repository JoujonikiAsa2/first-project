import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service";

const getAllFaculty = catchAsync(async(req, res) =>{
    const query = req.query
    console.log("test",req.cookies)
    const result = await facultyServices.getAllFacultyIntoDB(query)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})
const getSignleFaculty = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const result = await facultyServices.getSignleFacultyFromDB(id)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})
const updateSingleFaculty = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const {faculty} = req.body
    const result = await facultyServices.updateSingleFacultyIntoDB(id, faculty)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculties updated Successfully!",
        data: result
    })
})
const deleteSingleFaculty = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const result = await facultyServices.deleteSingleFacultyFromDB(id)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})

export const facultyControllers = {
    getAllFaculty,
    getSignleFaculty,
    updateSingleFaculty,
    deleteSingleFaculty
}