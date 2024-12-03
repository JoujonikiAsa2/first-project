import express from "express";
import { academicSemesterControllers } from "./academicSemester.controller";
import validateRequest from "../../middlewares/validateRequest";
import { AcademicSemesterValidations } from "./academicSemester.validation";

const router = express.Router();

///router will call controller function
router.post('/create-academic-semester', validateRequest(AcademicSemesterValidations.academicSemesterSchema) ,academicSemesterControllers.createAcademicSemester )
router.get('/' , academicSemesterControllers.getAcademicSemesters )
router.get('/:id' , academicSemesterControllers.getAcademicSemesters )
router.patch('/:id' , validateRequest(AcademicSemesterValidations.updateAcademicSemesterSchema), academicSemesterControllers.updateAcademicSemester )

export const academicSemesterRoutes = router