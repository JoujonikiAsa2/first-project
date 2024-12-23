import express from "express";
import { studentControllers } from "./student.controller";
import validateRequest from "../../middlewares/validateRequest";
import { studentValidations } from "./student.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

///router will call controller function
router.get('/',  auth(USER_ROLE.admin, USER_ROLE.faculty), studentControllers.getAllStudent)
router.get('/:id', auth(USER_ROLE.admin, USER_ROLE.faculty), studentControllers.getSingleStudent)
router.delete('/:id', auth(USER_ROLE.admin, USER_ROLE.faculty), studentControllers.deleteStudent)
router.patch('/:id', auth(USER_ROLE.admin, USER_ROLE.faculty), validateRequest(studentValidations.updateStudentValidationSchema), studentControllers.updateStudent)

export const studentRoutes = router