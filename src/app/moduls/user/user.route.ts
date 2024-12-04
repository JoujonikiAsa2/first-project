import express from "express";
import { userControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createStudentValidationSchema } from "../student/student.validation";
const router = express.Router();

router.post('/create-student', validateRequest(createStudentValidationSchema), userControllers.createStudent)
router.get('/', userControllers.getAllStudent)

export const userRoutes = router