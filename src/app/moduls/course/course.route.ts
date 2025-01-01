import { Router } from "express";
import { courseController } from "./course.controller";
import validateRequest from "../../middlewares/validateRequest";
import { courseValidations } from "./course.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router()

router.post('/create-course', auth(USER_ROLE.superAdmin, USER_ROLE.admin), courseController.createCourse)
router.get('/',courseController.getAllCourses)
router.get('/:id',courseController.getSingleCourse)
router.patch('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin),courseController.updateSingleCourse)
router.delete('/:id', auth(USER_ROLE.superAdmin, USER_ROLE.admin),courseController.deleteSingleCourse)
router.put('/:courseId/assign-faculties', auth(USER_ROLE.superAdmin, USER_ROLE.admin),validateRequest(courseValidations.facultiesWithCourseValidationSchema),courseController.assignFaculties)
router.get('/:courseId/get-course-faculties', auth(USER_ROLE.superAdmin, USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),validateRequest(courseValidations.facultiesWithCourseValidationSchema),courseController.getFacultiesWithCourse)
router.delete('/:courseId/remove-faculties', auth(USER_ROLE.superAdmin, USER_ROLE.admin),validateRequest(courseValidations.facultiesWithCourseValidationSchema),courseController.deleteAssignedFaculty)

export const courseRoutes = router