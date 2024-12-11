import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAllAdmin = catchAsync(async(req, res) =>{
    const query = req.query
    const result = await adminServices.getAllAdminIntoDB(query)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})
const getSingleAdmin = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const result = await adminServices.getSingleAdminFromDB(id)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})
const updateSingleAdmin = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const {admin} = req.body
    // console.log(admin)
    const result = await adminServices.updateSingleAdminIntoDB(id, admin)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins updated Successfully!",
        data: result
    })
})
const deleteSingleAdmin = catchAsync(async(req, res) =>{
    const {id} =  req.params
    const result = await adminServices.deleteSingleAdminFromDB(id)
    sendResponse(res,{
        statusCode: httpStatus.OK,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})

export const adminControllers = {
    getAllAdmin,
    getSingleAdmin,
    updateSingleAdmin,
    deleteSingleAdmin
}