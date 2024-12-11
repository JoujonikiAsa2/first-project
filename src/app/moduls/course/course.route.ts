import { Router } from "express";
import { courseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { courseValidations } from "./course.validation";

const router = Router()

router.post('/create-course', courseController.createCourse)
router.get('/',courseController.getAllCourses)
router.get('/:id',courseController.getSingleCourse)
router.patch('/:id',courseController.updateSingleCourse)
router.delete('/:id',courseController.deleteSingleCourse)
router.put('/:courseId/assign-faculties',validateRequest(courseValidations.facultiesWithCourseValidationSchema),courseController.assignFaculties)
router.delete('/:courseId/remove-faculties',validateRequest(courseValidations.facultiesWithCourseValidationSchema),courseController.deleteAssignedFaculty)

export const courseRoutes = router