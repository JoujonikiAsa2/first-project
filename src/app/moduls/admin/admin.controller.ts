import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAdmin = catchAsync(async(req, res) =>{
    const query = req.query
    const result = await adminServices.getAdminIntoDB(query)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})
const getSingleAdmin = catchAsync(async(req, res) =>{
    const {adminId} =  req.params
    const result = await adminServices.getSingleAdminFromDB(adminId)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})
const updateSingleAdmin = catchAsync(async(req, res) =>{
    const {adminId} =  req.params
    const {admin} = req.body
    console.log(admin)
    const result = await adminServices.updateSingleAdminIntoDB(adminId, admin)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admins updated Successfully!",
        data: result
    })
})
const deleteSingleAdmin = catchAsync(async(req, res) =>{
    const {adminId} =  req.params
    const result = await adminServices.deleteSingleAdminFromDB(adminId)
    sendResponse(res,{
        statusCode: 200,
        success: true,
        message: "Admins retrived Successfully!",
        data: result
    })
})

export const adminControllers = {
    getAdmin,
    getSingleAdmin,
    updateSingleAdmin,
    deleteSingleAdmin
}