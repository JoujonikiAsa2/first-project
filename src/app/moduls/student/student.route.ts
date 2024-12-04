import express from "express";
import { studentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";

const router = express.Router();

///router will call controller function
router.get('/', studentControllers.getAllStudent)
router.get('/:id', studentControllers.getSingleStudent)
router.delete('/:id', studentControllers.deleteStudent)
router.patch('/:id', validateRequest(studentValidations.updateStudentValidationSchema), studentControllers.updateStudent)

export const studentRoutes = router