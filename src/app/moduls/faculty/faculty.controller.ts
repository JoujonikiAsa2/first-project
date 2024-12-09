import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { facultyServices } from "./faculty.service";

const getFaculty = catchAsync(async(req, res) =>{
    const query = req.query
    const result = await facultyServices.getFacultyIntoDB(query)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})
const getSignleFaculty = catchAsync(async(req, res) =>{
    const {facultyId} =  req.params
    const result = await facultyServices.getSignleFacultyFromDB(facultyId)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})
const updateSingleFaculty = catchAsync(async(req, res) =>{
    const {facultyId} =  req.params
    const {faculty} = req.body
    console.log(faculty)
    const result = await facultyServices.updateSingleFacultyIntoDB(facultyId, faculty)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faculties updated Successfully!",
        data: result
    })
})
const deleteSingleFaculty = catchAsync(async(req, res) =>{
    const {facultyId} =  req.params
    const result = await facultyServices.deleteSingleFacultyFromDB(facultyId)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Faculties retrived Successfully!",
        data: result
    })
})

export const facultyControllers = {
    getFaculty,
    getSignleFaculty,
    updateSingleFaculty,
    deleteSingleFaculty
}